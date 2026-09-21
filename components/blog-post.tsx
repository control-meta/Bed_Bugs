import type { Metadata } from "next";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PhoneCall, ShieldCheck } from "lucide-react";
import { OpenFormButton } from "@/components/open-form-button";
import type { BlogItem } from "@/lib/blog-db";
import { FloatingBubblesBg } from "@/components/floating-bubbles-bg";

const SITE_URL = "https://bedbugstreatment.co.in";

export function buildBlogPostMetadata(blog: BlogItem): Metadata {
  return {
    title: {
      absolute: `${blog.title} | Bed Bug Treatment India`,
    },
    description:
      blog.excerpt ||
      `Comprehensive guide on ${blog.title.toLowerCase()}. Learn symptoms, safe prevention, and professional extermination options.`,
    alternates: {
      canonical: `${SITE_URL}/${blog.slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url: `${SITE_URL}/${blog.slug}`,
      images: blog.imageUrl ? [{ url: blog.imageUrl }] : [],
    },
  };
}

export function BlogPostArticle({ blog }: { blog: BlogItem }) {
  const firstMarkdownImage = blog.markdown.match(/!\[[^\]]*\]\(([^)]+)\)/)?.[1];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.imageUrl ? [blog.imageUrl] : [],
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,
    mainEntityOfPage: `${SITE_URL}/${blog.slug}`,
    author: {
      "@type": "Organization",
      name: blog.author || "Bed Bug Treatment Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Bed Bugs Treatment India",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        id="schema-blog-post"
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative overflow-hidden">
        <FloatingBubblesBg />
        <article className="relative z-10 min-h-screen pb-16 pt-16 sm:pt-20 lg:pt-24">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight mb-6">
            {blog.title}
          </h1>

          {/* Featured Image - Elegantly sized and centered (only if not already embedded at the top of markdown) */}
          {blog.imageUrl && !blog.markdown.includes(blog.imageUrl) && (
            <div className="mb-10 flex justify-center">
              <div className="relative w-full max-w-xl aspect-[3/2] rounded-2xl overflow-hidden border border-neutral-200/80 shadow-md bg-neutral-100">
                <Image
                  src={blog.imageUrl}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 576px"
                  quality={78}
                  preload
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          )}

          {/* Article Markdown */}
          <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-headings:text-emerald-900 prose-h2:text-emerald-800 prose-h3:text-emerald-700 prose-headings:tracking-tight prose-p:text-neutral-700 prose-p:leading-relaxed prose-li:text-neutral-700 prose-a:text-brand-600 prose-a:underline hover:prose-a:text-brand-700 prose-blockquote:border-l-emerald-600 prose-blockquote:bg-emerald-50/40 prose-blockquote:p-4 prose-blockquote:rounded-r-2xl prose-table:border-collapse prose-table:w-full prose-table:my-6 prose-th:border prose-th:border-emerald-200 prose-th:bg-emerald-50/90 prose-th:text-emerald-900 prose-th:p-3 prose-th:font-bold prose-td:border prose-td:border-neutral-200 prose-td:p-3 text-sm sm:text-base">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ node, ...props }) => (
                  <span className="my-8 flex flex-col items-center not-prose w-full">
                    <span className="relative w-full max-w-xl aspect-[3/2] rounded-2xl overflow-hidden border border-neutral-200/80 shadow-md bg-neutral-100 block">
                      <Image
                        src={typeof props.src === "string" ? props.src : ""}
                        alt={props.alt || ""}
                        title={props.title || undefined}
                        fill
                        sizes="(max-width: 640px) 100vw, 576px"
                        quality={78}
                        preload={props.src === firstMarkdownImage}
                        className="w-full h-full object-cover object-top m-0"
                      />
                    </span>
                    {props.alt && (
                      <span className="text-center text-xs text-neutral-500 mt-2.5 font-medium italic block">
                        {props.alt}
                      </span>
                    )}
                  </span>
                ),
              }}
            >
              {blog.markdown.replace(/^\s*#\s+[^\n]+(?:\r?\n)+/, "")}
            </ReactMarkdown>
          </div>

          {/* Bottom Conversion CTA */}
          <div className="mt-14 rounded-3xl bg-gradient-to-br from-brand-900 via-neutral-900 to-brand-950 p-8 text-white shadow-xl">
            <div className="max-w-2xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 bg-brand-950/60 px-3 py-1 rounded-md border border-brand-800/60">
                100% Odorless Treatment
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-3 mb-2">
                Need Immediate Bed Bug Relief in Your Home?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 mb-6 leading-relaxed">
                BedBugsTreatment.co.in offers government-approved chemicals, same-day inspection visits, and a 12-month service warranty across India.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <a
                  href="tel:+919769321234"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-brand-700 transition"
                >
                  <PhoneCall className="h-4 w-4" /> Call +91 97693 21234
                </a>
                <OpenFormButton
                  ariaLabel="Book Free Inspection"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-white/20 transition border border-white/10"
                >
                  <ShieldCheck className="h-4 w-4" /> Book Free Inspection
                </OpenFormButton>
              </div>
            </div>
          </div>
        </div>
      </article>
      </div>
    </>
  );
}
