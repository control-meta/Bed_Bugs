import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { getCalendarPlans, saveCalendarPlans, BlogPlan } from "./calendar-db";
import { saveBlog, BlogItem } from "./blog-db";
import { injectBlogImages } from "./blog/image-selector";
import { generateFreshBlogImages } from "./blog/ai-image-generator";
import { runBlogPipeline } from "./blog/pipeline";
import { sendBlogPublishedEmail } from "./email";


export interface AutoPublishLog {
  id: string;
  date: string;
  topic: string;
  slug: string;
  status: "success" | "error";
  message: string;
  timestamp: string;
  blogId?: string;
}

export interface AutoPublishConfig {
  enabled: boolean;
  frequency: "1min" | "6h" | "12h" | "24h" | "daily";
  dailyTime: string; // HH:mm e.g. "09:00"
  lastRunAt?: string;
  nextRunAt?: string;
  logs: AutoPublishLog[];
}

const CONFIG_FILE_PATH = path.join(process.cwd(), ".auto_publish_config.json");

const DEFAULT_CONFIG: AutoPublishConfig = {
  enabled: false,
  frequency: "1min",
  dailyTime: "09:00",
  logs: [],
};

export function getAutoPublishConfig(): AutoPublishConfig {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const content = fs.readFileSync(CONFIG_FILE_PATH, "utf8");
      const parsed = JSON.parse(content);
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        logs: Array.isArray(parsed.logs) ? parsed.logs : [],
      };
    }
  } catch (err) {
    console.error("[auto-publish] Error reading config:", err);
  }
  return { ...DEFAULT_CONFIG };
}

export function saveAutoPublishConfig(config: AutoPublishConfig): void {
  try {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), "utf8");
    if (config.enabled && config.nextRunAt) {
      startAutoPublishServerWorker();
    } else {
      stopAutoPublishServerWorker();
    }
  } catch (err) {
    console.error("[auto-publish] Error saving config:", err);
  }
}

// ==============================================================================
// Server-Side Autonomous Background Worker
// Runs in the Node.js Next.js server independently of client browser sessions
// ==============================================================================
declare global {
  var __autoPublishWorkerTimer: NodeJS.Timeout | null | undefined;
  var __autoPublishIsExecuting: boolean | undefined;
}

export function startAutoPublishServerWorker() {
  if (globalThis.__autoPublishWorkerTimer) {
    return;
  }

  console.log("[auto-publish-worker] 🚀 Initialized server-side background worker in Node process.");

  // Check every 2 seconds for scheduled executions
  globalThis.__autoPublishWorkerTimer = setInterval(async () => {
    try {
      await checkAndExecuteDueAutoPublish();
    } catch (err) {
      console.error("[auto-publish-worker] Ticker execution error:", err);
    }
  }, 2000);

  if (globalThis.__autoPublishWorkerTimer?.unref) {
    globalThis.__autoPublishWorkerTimer.unref();
  }
}

export function stopAutoPublishServerWorker() {
  if (globalThis.__autoPublishWorkerTimer) {
    clearInterval(globalThis.__autoPublishWorkerTimer);
    globalThis.__autoPublishWorkerTimer = null;
    console.log("[auto-publish-worker] 🛑 Server-side background worker stopped.");
  }
}

export async function checkAndExecuteDueAutoPublish(): Promise<{ executed: boolean; result?: any }> {
  if (globalThis.__autoPublishIsExecuting) {
    return { executed: false };
  }

  const config = getAutoPublishConfig();
  if (!config.enabled || !config.nextRunAt) {
    return { executed: false };
  }

  const nextRunTime = new Date(config.nextRunAt).getTime();
  const now = Date.now();

  // If scheduled time has arrived (allow 500ms jitter)
  if (now >= nextRunTime - 500) {
    globalThis.__autoPublishIsExecuting = true;
    console.log(`[auto-publish-worker] ⏰ Scheduled run time arrived (${config.nextRunAt}). Executing auto-publish pipeline...`);
    try {
      const result = await executeAutoPublish();
      return { executed: true, result };
    } catch (err) {
      console.error("[auto-publish-worker] Execution pipeline error:", err);
      return { executed: false };
    } finally {
      globalThis.__autoPublishIsExecuting = false;
    }
  }

  return { executed: false };
}

// Auto-start worker on module load if already enabled in config
try {
  const initialConfig = getAutoPublishConfig();
  if (initialConfig.enabled && initialConfig.nextRunAt) {
    startAutoPublishServerWorker();
  }
} catch {}

export function calculateNextRunTime(
  frequency: AutoPublishConfig["frequency"],
  dailyTime: string = "09:00",
  baseDate: Date = new Date()
): string {
  const now = baseDate.getTime();

  switch (frequency) {
    case "1min":
      return new Date(now + 60 * 1000).toISOString();
    case "6h":
      return new Date(now + 6 * 60 * 60 * 1000).toISOString();
    case "12h":
      return new Date(now + 12 * 60 * 60 * 1000).toISOString();
    case "24h":
      return new Date(now + 24 * 60 * 60 * 1000).toISOString();
    case "daily": {
      const [hours, minutes] = dailyTime.split(":").map((v) => parseInt(v, 10) || 0);
      const target = new Date(baseDate);
      target.setHours(hours, minutes, 0, 0);
      // If time today has already passed, schedule for tomorrow
      if (target.getTime() <= now) {
        target.setDate(target.getDate() + 1);
      }
      return target.toISOString();
    }
    default:
      return new Date(now + 60 * 1000).toISOString();
  }
}

/**
 * Finds the next ungenerated planned post from the calendar.
 * Prioritizes today or upcoming planned dates.
 */
export async function getNextPlannedPost(): Promise<BlogPlan | null> {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Try current month first
  const { plan: currentPlan } = await getCalendarPlans(currentMonth, currentYear);
  const todayStr = now.toISOString().split("T")[0];

  // Look for today's post if ungenerated
  const todayPost = currentPlan.find((p) => p.date === todayStr && p.status !== "generated");
  if (todayPost) return todayPost;

  // Look for any upcoming planned post this month
  const upcomingThisMonth = currentPlan
    .filter((p) => p.status !== "generated" && p.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (upcomingThisMonth.length > 0) return upcomingThisMonth[0];

  // Next look for any ungenerated post earlier this month
  const anyThisMonth = currentPlan
    .filter((p) => p.status !== "generated")
    .sort((a, b) => a.date.localeCompare(b.date));
  if (anyThisMonth.length > 0) return anyThisMonth[0];

  // Try next month
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
  const { plan: nextPlan } = await getCalendarPlans(nextMonth, nextYear);
  const nextMonthPlanned = nextPlan
    .filter((p) => p.status !== "generated")
    .sort((a, b) => a.date.localeCompare(b.date));
  if (nextMonthPlanned.length > 0) return nextMonthPlanned[0];

  return null;
}

/**
 * Executes a single automated blog generation and publish cycle.
 */
export async function executeAutoPublish(): Promise<{
  success: boolean;
  blog?: BlogItem;
  planItem?: BlogPlan;
  message: string;
}> {
  const config = getAutoPublishConfig();
  const planItem = await getNextPlannedPost();

  if (!planItem) {
    const errorLog: AutoPublishLog = {
      id: "log_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      topic: "No planned posts found",
      slug: "",
      status: "error",
      message: "No planned posts available in calendar to auto-publish.",
      timestamp: new Date().toISOString(),
    };
    config.logs = [errorLog, ...config.logs.slice(0, 49)];
    config.nextRunAt = calculateNextRunTime(config.frequency, config.dailyTime);
    saveAutoPublishConfig(config);
    return { success: false, message: "No planned posts available in calendar." };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { success: false, message: "OPENAI_API_KEY is not configured on server." };
  }

  try {
    console.log(`[auto-publish] Running rigorous AI pipeline for: "${planItem.topic}" (${planItem.date})...`);
    
    // 1. Run the advanced multi-stage pipeline (Intent -> Research -> Draft -> Audit -> Revise)
    const pipelineResult = await runBlogPipeline({
      topic: planItem.topic,
      keywords: planItem.keywords.join(", ")
    });

    let finalMarkdown = pipelineResult.blogContent;
    let topImage;
    let midImage;

    // 2. Generate and inject fresh images
    try {
      console.log(`[auto-publish] Generating two fresh AI images for: "${planItem.topic}"...`);
      const openai = new OpenAI({ apiKey });
      const generatedImages = await generateFreshBlogImages({
        openai,
        topic: planItem.topic,
        keywords: planItem.keywords,
        articleMarkdown: finalMarkdown,
        recommendedVisuals: pipelineResult.imageRecommendations,
      });

      const imagePlacement = injectBlogImages(
        finalMarkdown,
        planItem.topic,
        planItem.keywords,
        false,
        generatedImages.topImage,
        generatedImages.midImage
      );

      finalMarkdown = imagePlacement.markdownWithImages;
      topImage = imagePlacement.topImage;
      midImage = imagePlacement.midImage;
      
      if (!topImage || !midImage || !topImage.url.startsWith("/images/blogs/ai/") || !midImage.url.startsWith("/images/blogs/ai/")) {
        console.warn("[auto-publish] Notice: Fresh AI images were not fully placed. Falling back to existing assets.");
      }
    } catch (imgErr) {
      console.error("[auto-publish] Image generation failed, proceeding without AI images:", imgErr);
    }

    // 3. Save the final updated blog and mark as published
    const updatedBlog = {
      id: pipelineResult.articleId,
      slug: pipelineResult.metadata.urlSlug,
      title: pipelineResult.metadata.h1,
      topic: planItem.topic,
      primaryKeyword: pipelineResult.research.searchIntent.primaryKeyword || planItem.keywords[0] || "bed bug treatment",
      keywords: planItem.keywords,
      markdown: finalMarkdown,
      excerpt: pipelineResult.metadata.metaDescription || `Comprehensive guide on ${pipelineResult.metadata.h1}.`,
      imageUrl: topImage?.url || "",
      images: [
        ...(topImage ? [{ url: topImage.url, alt: topImage.alt, title: topImage.caption }] : []),
        ...(midImage ? [{ url: midImage.url, alt: midImage.alt, title: midImage.caption }] : []),
      ],
      status: "published" as const,
      publicationStatus: pipelineResult.audit.status,
      autoPublishEligible: pipelineResult.audit.autoPublishEligible,
      author: "Bed Bug Treatment Team",
      readTime: "9 min read", 
    };

    const { blog } = await saveBlog(updatedBlog);
    console.log(`[auto-publish] ✅ Successfully updated & published blog: /${blog.slug}`);

    // Send email notification for auto-published blog
    sendBlogPublishedEmail({
      id: blog.id,
      slug: blog.slug,
      title: blog.title,
      topic: blog.topic,
      score: pipelineResult.audit.overallPublishingConfidence,
      tokenUse: pipelineResult.usage.totalTokens,
    }).catch((err) => console.error("Async email failed:", err));

    // Update calendar plan item to generated
    try {
      const parts = planItem.date.split("-");
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[0], 10);
      const { plan: monthPlans } = await getCalendarPlans(month, year);
      const updatedPlans = monthPlans.map((p) =>
        p.date === planItem.date ? { ...p, status: "generated" as const } : p
      );
      await saveCalendarPlans(updatedPlans, month, year);
    } catch (calErr) {
      console.warn("[auto-publish] Notice updating calendar plan item status:", calErr);
    }

    // Update config logs & schedule next run
    const nowIso = new Date().toISOString();
    config.lastRunAt = nowIso;
    if (config.frequency === "1min") {
      // In 1-minute test mode, pause after 1 test run so it does not loop endlessly
      config.enabled = false;
      config.nextRunAt = undefined;
    } else {
      config.nextRunAt = calculateNextRunTime(config.frequency, config.dailyTime);
    }

    const successLog: AutoPublishLog = {
      id: "log_" + Date.now(),
      date: planItem.date,
      topic: planItem.topic,
      slug: blog.slug,
      status: "success",
      message: `Published successfully as "${blog.title}".`,
      timestamp: nowIso,
      blogId: blog.id,
    };
    config.logs = [successLog, ...config.logs.slice(0, 49)];
    saveAutoPublishConfig(config);

    return {
      success: true,
      blog,
      planItem,
      message: `Successfully generated and published: "${blog.title}"`,
    };
  } catch (err: any) {
    console.error("[auto-publish] Execution failed:", err);
    const nowIso = new Date().toISOString();
    config.lastRunAt = nowIso;
    config.nextRunAt = calculateNextRunTime(config.frequency, config.dailyTime);

    const errorLog: AutoPublishLog = {
      id: "log_" + Date.now(),
      date: planItem.date,
      topic: planItem.topic,
      slug: "",
      status: "error",
      message: err.message || "Failed to generate blog.",
      timestamp: nowIso,
    };
    config.logs = [errorLog, ...config.logs.slice(0, 49)];
    saveAutoPublishConfig(config);

    return {
      success: false,
      message: err.message || "Failed to generate blog with AI.",
    };
  }
}
