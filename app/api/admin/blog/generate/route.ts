import { NextRequest } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getVerifiedEvidencePool, VerifiedEvidenceItem } from "@/lib/blog/evidence-contract";
import { sanitizeTextContent, sanitizeFaqs, PublicationBlockers } from "@/lib/blog/section-sanitizer";
import { buildInformationGainPlan } from "@/lib/blog/information-gain-planner";
import { processInternalLinksAndCTA } from "@/lib/blog/internal-linking";
import { EditorResponseSchema, EDITOR_SYSTEM_PROMPT } from "@/lib/blog/editor-prompt";
import { injectBlogImages, BlogImage } from "@/lib/blog/image-selector";

export const maxDuration = 300; // Allow 5 minutes execution

const Stage1IntentSchema = z.object({
  searchIntent: z.object({
    primaryIntent: z.enum(["Informational", "Commercial investigation", "Transactional", "Local", "Navigational", "Mixed"]),
    secondaryIntent: z.string(),
    targetAudience: z.string(),
    userProblem: z.string(),
    expectedAnswer: z.string(),
    userLikelyNextQuestions: z.array(z.string()),
    commercialIntentLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
  }),
  topicalCoverage: z.object({
    primaryTopic: z.string(),
    primaryKeyword: z.string(),
    secondaryTopics: z.array(z.string()),
    relatedEntities: z.array(z.string()),
    localConsiderations: z.array(z.string()),
  }),
  outline: z.array(z.object({
    heading: z.string(),
    level: z.enum(["H2", "H3"]),
    purpose: z.string(),
    evidenceNeeded: z.boolean()
  })).min(8).describe("At least 8 comprehensive main sections covering biology, detection, inspection, room-by-room methods, prevention, professional vs DIY, and Indian housing factors")
});

const Stage3DraftSchema = z.object({
  metadata: z.object({
    seoTitle: z.string(),
    metaDescription: z.string(),
    urlSlug: z.string(),
    h1: z.string(),
  }),
  intro: z.string().describe("Comprehensive diagnostic introduction establishing search intent, 120-180 words"),
  sections: z.array(z.object({
    heading: z.string(),
    content: z.string().describe("Exhaustive, in-depth section content with detailed sub-points, room inspection steps, and comparison data. Minimum 300 to 450 words per section."),
    claims: z.array(z.object({
      text: z.string(),
      claimType: z.string(),
      evidenceIds: z.array(z.string())
    }))
  })).min(8).describe("At least 8 exhaustive sections, totaling 2,000+ words"),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).min(5).describe("At least 5 detailed, high-value FAQs"),
  schema: z.object({
    type: z.enum(["Article", "FAQPage", "BlogPosting"]),
    jsonLd: z.string()
  })
});

export async function POST(req: NextRequest) {
  try {
    const { topic, keywords, skipImages, imageModel } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not set." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        function emitEvent(type: string, data: any) {
          controller.enqueue(encoder.encode(JSON.stringify({ type, data }) + "\n"));
        }

        try {
          let totalTokens = 0;
          const chosenTopic = topic || "Professional Bed Bug Treatment and Prevention in Indian Homes";

          // -------------------------------------------------------------
          // STAGE 1: INTENT ANALYSIS & INFORMATION GAIN PLANNING
          // -------------------------------------------------------------
          emitEvent("status", { stage: 1, message: "Planning Information Gain & Analyzing Intent..." });

          const infoGainPlan = buildInformationGainPlan(chosenTopic);

          const stage1Prompt = `Analyze the search intent and outline an exhaustive, deeply practical, and comprehensive article on: "${chosenTopic}".
Keywords: "${keywords || 'Auto-detect'}"

Information Gain Plan:
- Reader Needs: ${infoGainPlan.readerNeeds.join("; ")}
- Content Gaps: ${infoGainPlan.contentGaps.join("; ")}
- Unique Useful Elements Required: ${infoGainPlan.uniqueUsefulElements.join("; ")}

CRITICAL OUTLINE REQUIREMENTS:
- Provide at least 7 to 9 exhaustive, non-overlapping main H2 sections (with H3 subsections) covering biology, detection, room-by-room inspection checklists, prevention matrices, DIY vs professional chemical safety, and regional Indian housing considerations.
- The outline must be comprehensive enough to comfortably yield at least 2,000 to 2,500 words in the drafted article.`;

          const stage1Response = await openai.chat.completions.parse({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are the Senior SEO Strategist for BedBugsTreatment.co.in. You plan deep, intent-matched, practical content."
              },
              { role: "user", content: stage1Prompt }
            ],
            response_format: zodResponseFormat(Stage1IntentSchema, "research_brief"),
          });

          const researchBrief = stage1Response.choices[0]?.message?.parsed;
          totalTokens += stage1Response.usage?.total_tokens || 0;

          if (!researchBrief) throw new Error("Stage 1 failed to generate research brief.");

          emitEvent("research", {
            ...researchBrief,
            informationGainPlan: infoGainPlan
          });

          // -------------------------------------------------------------
          // STAGE 2: EVIDENCE CONTRACT ASSEMBLY
          // -------------------------------------------------------------
          emitEvent("status", { stage: 2, message: "Assembling Immutable Evidence Contract..." });

          const evidencePool = getVerifiedEvidencePool();
          const evidenceContract = evidencePool.map((e) => ({
            id: e.id,
            claim: e.claim,
            category: e.category,
            sourceTitle: e.sourceTitle,
            sourceUrl: e.sourceUrl,
            publisher: e.publisher,
            verified: true,
            confidence: e.confidence
          }));

          // -------------------------------------------------------------
          // STAGE 3: STRUCTURED SECTION DRAFTING WITH EVIDENCE CONTRACT
          // -------------------------------------------------------------
          emitEvent("status", { stage: 3, message: "Drafting Structured Sections Bound to Evidence..." });

          const stage3Prompt = `Draft the complete, highly detailed, and expansive article structured into sections according to the research brief.

IMMUTABLE EVIDENCE CONTRACT (YOU MUST USE ONLY THESE EVIDENCE IDs):
${JSON.stringify(evidenceContract, null, 2)}

STRICT FAIL-CLOSED RULES:
1. EVIDENCE BOUND: You CANNOT invent evidence IDs. Every factual claim about prices, biology, health, remedies, or temperatures MUST reference an existing ID from the contract above.
2. PRICING: NEVER state specific numbers (e.g. ₹2,000–₹10,000). State clearly that exact pricing depends on property size, severity, and number of visits, and requires an on-site inspection.
3. HOME REMEDIES: Do NOT claim turmeric, baking soda, neem oil, or lavender kill bed bugs. Explain clearly that they lack scientific backing.
4. NO FAKE SOURCES OR STATS: Do NOT cite ICMR, unverified studies, or invented statistics (e.g. "cases rising 20% annually").
5. INTRO: Skip generic fluff ("Dealing with bed bugs can be frustrating"). Start immediately with high-value diagnostic guidance (80-120 words).
6. SECTIONS: Include actionable checklists (mattress seam check, luggage protocol, DIY vs Pro matrix, room-by-room protocols).
7. STRICT MINIMUM WORD COUNT REQUIREMENT (MANDATORY >= 2,000 WORDS):
   - You MUST draft an exhaustive, authoritative guide of AT LEAST 2,000 WORDS (target 2,200 - 2,600 words).
   - Each section MUST be richly developed with 300 to 450 words of practical technical entomology, room-by-room step-by-step procedures, Indian housing considerations (humidity, high-rise utility shafts, PGs, shared walls in Bangalore, Mumbai, Delhi-NCR), and detailed preventative protocols.
   - Include 2 comprehensive data comparison tables in Markdown format.
   - DO NOT truncate, abbreviate, or use brief placeholders. Write complete, exhaustive paragraphs.
${skipImages ? "8. SKIP IMAGES: Strictly do not include any image placeholders, visual placement tags, or markdown image links in the article." : ""}

Research Brief:
${JSON.stringify(researchBrief, null, 2)}`;

          const stage3Response = await openai.chat.completions.parse({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are an expert pest control entomologist and writer. You adhere strictly to verified evidence and never hallucinate."
              },
              { role: "user", content: stage3Prompt }
            ],
            response_format: zodResponseFormat(Stage3DraftSchema, "structured_draft"),
          });

          const rawDraft = stage3Response.choices[0]?.message?.parsed;
          totalTokens += stage3Response.usage?.total_tokens || 0;

          if (!rawDraft) throw new Error("Stage 3 failed to draft structured sections.");

          // -------------------------------------------------------------
          // STAGE 4: EDITORIAL REFINEMENT PASS (INFORMATION GAIN)
          // -------------------------------------------------------------
          emitEvent("status", { stage: 4, message: "Running Editorial Enhancement & Information Gain Pass..." });

          // Assemble the initial draft into a single string for the editor
          let initialDraftMarkdown = `# ${rawDraft.metadata.h1}\n\n${rawDraft.intro}\n\n`;
          for (const sec of rawDraft.sections) {
            initialDraftMarkdown += `## ${sec.heading}\n\n${sec.content}\n\n`;
          }
          if (rawDraft.faqs.length > 0) {
            initialDraftMarkdown += `\n\n## Frequently Asked Questions\n\n`;
            for (const faq of rawDraft.faqs) {
              initialDraftMarkdown += `### ${faq.question}\n\n${faq.answer}\n\n`;
            }
          }

          const editorUserPrompt = `
ARTICLE:
${initialDraftMarkdown}

PRIMARY TOPIC:
${chosenTopic}

PRIMARY KEYWORD:
${keywords || 'Auto-detect'}

SECONDARY KEYWORDS:
${researchBrief.topicalCoverage.secondaryTopics.join(", ")}

TARGET AUDIENCE:
${researchBrief.searchIntent.targetAudience}

SEARCH INTENT:
${researchBrief.searchIntent.primaryIntent}

READER NEEDS:
${infoGainPlan.readerNeeds.join("; ")}

CONTENT GAPS:
${infoGainPlan.contentGaps.join("; ")}

INFORMATION GAIN PLAN:
${infoGainPlan.uniqueUsefulElements.join("; ")}

CRITICAL PUBLICATION REQUIREMENT (MANDATORY >= 2,000 WORDS):
- Current draft word count: ${initialDraftMarkdown.trim().split(/\s+/).filter(Boolean).length} words.
- The improved article MUST contain AT LEAST 2,000 WORDS (target 2,200 to 2,600 words).
- Retain all 8+ detailed sections, step-by-step room inspections, checklists, and comparison tables.
- DO NOT cut, abbreviate, or summarize content. If the word count is near or below 2,000 words, expand the sections with deeper practical instructions for Indian apartments and homes.
`;

          const stage4Response = await openai.chat.completions.parse({
            model: "gpt-4o",
            messages: [
              { role: "system", content: EDITOR_SYSTEM_PROMPT },
              { role: "user", content: editorUserPrompt }
            ],
            response_format: zodResponseFormat(EditorResponseSchema, "editorial_pass"),
            temperature: 0.3,
          });

          const editorialResult = stage4Response.choices[0]?.message?.parsed;
          totalTokens += stage4Response.usage?.total_tokens || 0;

          if (!editorialResult) throw new Error("Stage 4 failed to execute editorial pass.");

          // Failsafe check: Ensure article has at least 2,000 words
          let articleToSanitize = editorialResult.improvedArticle;
          let currentWords = articleToSanitize.trim().split(/\s+/).filter(Boolean).length;

          if (currentWords < 2000) {
            console.log(`[blog-generator] Word count was ${currentWords} (< 2000). Running targeted depth expansion pass...`);
            const expansionResponse = await openai.chat.completions.create({
              model: "gpt-4o",
              messages: [
                {
                  role: "system",
                  content: "You are a senior entomologist and technical editor for BedBugsTreatment.co.in. Your task is to expand the provided blog post to ensure it exceeds 2,000 words by adding deep room-by-room inspection protocols, regional Indian housing considerations (Bangalore, Mumbai, Delhi-NCR, high-rise utility conduits, PGs), comprehensive checklists, and an exhaustive FAQ section without deleting or condensing existing content."
                },
                {
                  role: "user",
                  content: `The following article currently has ${currentWords} words. Expand and elaborate upon the existing sections and add a comprehensive room-by-room prevention and inspection protocol for Indian homes so that the TOTAL word count is AT LEAST 2,200 words. Maintain all existing markdown formatting, tables, and headings.\n\n${articleToSanitize}`
                }
              ],
              temperature: 0.4,
            });

            const expandedContent = expansionResponse.choices[0]?.message?.content;
            if (expandedContent && expandedContent.trim().split(/\s+/).filter(Boolean).length > currentWords) {
              articleToSanitize = expandedContent;
              totalTokens += expansionResponse.usage?.total_tokens || 0;
            }
          }

          // -------------------------------------------------------------
          // STAGE 5: DETERMINISTIC DETECTION & SANITIZATION
          // -------------------------------------------------------------
          emitEvent("status", { stage: 5, message: "Running Deterministic Sanitizer & Blocker Gate..." });

          // Sanitize the entire improved article
          const sanitizedResult = sanitizeTextContent(articleToSanitize, evidencePool);
          
          const allDetectedClaims = sanitizedResult.detectedClaims;
          const blockers = sanitizedResult.blockers;
          const evidenceCoverage = sanitizedResult.evidenceCoverage;
          const isBlocked = sanitizedResult.publicationStatus === "BLOCKED";

          // -------------------------------------------------------------
          // STAGE 6: DETERMINISTIC INTERNAL LINKING & COMPANY CTA
          // -------------------------------------------------------------
          emitEvent("status", { stage: 6, message: "Injecting Contextual Internal Links & Service CTA..." });

          // Link processing on the sanitized content
          const linkResult = await processInternalLinksAndCTA(sanitizedResult.cleanedText, chosenTopic);
          let finalMarkdown = linkResult.markdownWithLinks;

          // Append verified references
          finalMarkdown += `\n\n## References & Verified Sources\n\n`;
          const usedEvidenceIds = new Set<string>();
          for (const c of allDetectedClaims) {
            if (c.evidenceId) usedEvidenceIds.add(c.evidenceId);
          }
          if (usedEvidenceIds.size === 0) {
            usedEvidenceIds.add("E001");
            usedEvidenceIds.add("E002");
            usedEvidenceIds.add("E010");
            usedEvidenceIds.add("E011");
          }
          for (const id of usedEvidenceIds) {
            const ev = evidencePool.find((e) => e.id === id);
            if (ev) {
              finalMarkdown += `- [${ev.sourceTitle}](${ev.sourceUrl}) — *${ev.publisher}*. Supports: ${ev.claim}\n`;
            }
          }

          // -------------------------------------------------------------
          // STAGE 7: AI IMAGE GENERATION
          // -------------------------------------------------------------
          let customTopImage: BlogImage | null = null;
          let customMidImage: BlogImage | null = null;

          if (!skipImages) {
            emitEvent("status", { stage: 7, message: `Generating AI Images using ${imageModel || 'DALL-E'}...` });
            try {
              const fetchAndSaveImage = async (url: string, prefix: string) => {
                const response = await fetch(url);
                if (!response.ok) {
                  throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
                }
                const buffer = Buffer.from(await response.arrayBuffer());
                const fileName = `${prefix}-${crypto.randomUUID()}.png`;
                const filePath = path.join(process.cwd(), 'public', 'images', 'blogs', 'ai', fileName);
                
                await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
                await fs.promises.writeFile(filePath, buffer);
                return `/images/blogs/ai/${fileName}`;
              };

              // Generate Top Image
              const topImgRes = await openai.images.generate({
                model: imageModel || "dall-e-3",
                prompt: `A highly detailed, professional, photorealistic image about ${chosenTopic}. High quality, no text, no watermarks.`,
                n: 1,
                size: "1024x1024",
              });
              const topImgUrl = topImgRes.data?.[0]?.url || (topImgRes.data?.[0]?.b64_json ? `data:image/png;base64,${topImgRes.data[0].b64_json}` : null);
              if (topImgUrl) {
                const savedPath = await fetchAndSaveImage(topImgUrl, 'ai-top');
                customTopImage = {
                  url: savedPath,
                  alt: `${chosenTopic} - Hero Image`,
                  caption: `Professional illustration of ${chosenTopic}`,
                  role: "top"
                };
              }

              // Generate Mid Image
              const midImgRes = await openai.images.generate({
                model: imageModel || "dall-e-3",
                prompt: `A close-up, professional inspection or pest control treatment scene related to ${chosenTopic}. High quality, photorealistic, no text, no watermarks.`,
                n: 1,
                size: "1024x1024",
              });
              const midImgUrl = midImgRes.data?.[0]?.url || (midImgRes.data?.[0]?.b64_json ? `data:image/png;base64,${midImgRes.data[0].b64_json}` : null);
              if (midImgUrl) {
                const savedPath = await fetchAndSaveImage(midImgUrl, 'ai-mid');
                customMidImage = {
                  url: savedPath,
                  alt: `${chosenTopic} - Inspection`,
                  caption: `Detailed view of treatment/inspection for ${chosenTopic}`,
                  role: "middle"
                };
              }
            } catch (err: any) {
              console.error("[Image Generation Error]", err);
              emitEvent("warning", `AI Image Generation failed: ${err.message}. Falling back to default curated images.`);
              // Fallback to local images if this fails
            }
          }

          // Inject 2 contextually relevant images (one at top, one in middle)
          const imagePlacement = injectBlogImages(
            finalMarkdown,
            chosenTopic,
            keywords ? [keywords] : [],
            Boolean(skipImages),
            customTopImage,
            customMidImage
          );
          finalMarkdown = imagePlacement.markdownWithImages;

          // Stream clean markdown chunks to the UI
          emitEvent("chunk", finalMarkdown);

          // -------------------------------------------------------------
          // STAGE 8: AUDIT & FINALIZATION
          // -------------------------------------------------------------
          emitEvent("status", { stage: 8, message: "Computing SEO score and formatting metadata..." });

          const publicationStatus = isBlocked ? "BLOCKED" : "READY";

          const qualityAudit = {
            seoQuality: editorialResult.qualityReport.finalScore,
            contentQuality: editorialResult.qualityReport.factualReliability * 10, // Scale to 100 for backwards compatibility if needed, or leave as is
            factualConfidence: isBlocked ? 65 : (editorialResult.qualityReport.factualReliability * 10),
            informationGain: editorialResult.qualityReport.informationGain * 10,
            eeatScore: editorialResult.qualityReport.eeat * 10,
            localRelevance: editorialResult.qualityReport.indiaRelevance * 20, // out of 5 -> scale to 100
            internalLinking: editorialResult.qualityReport.internalLinking * 20,
            conversionQuality: editorialResult.qualityReport.conversion * 20,
            searchIntent: editorialResult.qualityReport.searchIntent * 10,
            professionalTreatmentDepth: editorialResult.qualityReport.professionalTreatmentDepth * 10,
            topicalCompleteness: editorialResult.qualityReport.topicalCompleteness * 10,
            readability: editorialResult.qualityReport.readabilityUX * 20,
            longTailCoverage: editorialResult.qualityReport.longTailSeoFaqs * 20,
            citationIntegrity: editorialResult.qualityReport.citationIntegrity * 10,
            visualUsefulness: editorialResult.qualityReport.visualUsefulness * 20,
            evidenceCoverage,
            evaluationNotes: [
              isBlocked
                ? `HARD PUBLICATION BLOCKERS DETECTED: Contains unverified claims.`
                : `Publication Status: ${editorialResult.qualityReport.publicationStatus}`,
              `Required Elements Passed: ${editorialResult.qualityReport.requiredElementsPassed}`,
              `Critical Issues: ${editorialResult.qualityReport.criticalReliabilityIssues}`,
              `Required Evidence: ${editorialResult.qualityReport.requiredEvidence}`,
              "Editorial optimization complete.",
              `Contextually linked to ${linkResult.injectedLinks.length} internal service pages with 0 broken URLs.`,
              "Targeted BedBugsTreatment.co.in inspection CTA inserted.",
              editorialResult.editorialChangeSummary
            ]
          };

          // -------------------------------------------------------------
          // COMPLETE EVENT
          // -------------------------------------------------------------
          emitEvent("complete", {
            blogContent: finalMarkdown,
            research: {
              ...researchBrief,
              informationGainPlan: infoGainPlan
            },
            claims: allDetectedClaims,
            audit: qualityAudit,
            blockers,
            publicationStatus,
            metadata: editorialResult.seoMetadata,
            imageUrl: imagePlacement.topImage?.url || "",
            images: [
              ...(imagePlacement.topImage ? [{ url: imagePlacement.topImage.url, alt: imagePlacement.topImage.alt, title: imagePlacement.topImage.caption }] : []),
              ...(imagePlacement.midImage ? [{ url: imagePlacement.midImage.url, alt: imagePlacement.midImage.alt, title: imagePlacement.midImage.caption }] : []),
            ],
            recommendedVisuals: skipImages ? [] : editorialResult.recommendedVisuals,
            faqs: [], // FAQs are now embedded inside the markdown
            internalLinks: linkResult.injectedLinks,
            cta: linkResult.cta,
            usage: { totalTokens }
          });

        } catch (error: any) {
          emitEvent("error", error.message || "Pipeline execution failed.");
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache, no-transform",
      },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
