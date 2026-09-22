import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FloatingContact } from "@/components/floating-contact";
import { FloatingForm } from "@/components/floating-form";
import { ScrollToTop } from "@/components/scroll-to-top";
import { MarketingOnly } from "@/components/marketing-only";
import { site } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://bedbugstreatment.co.in"),
  title: {
    default: "Bed Bug Treatment & Pest Control Services in India",
    template: "%s | BedBug Treatment",
  },
  description: site.description,
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "bed bug treatment",
    "bed bug control",
    "bed bug exterminator",
    "bed bug treatment near me",
    "odourless bed bug treatment",
    "bed bug treatment Pune",
    "bed bug treatment Mumbai",
    "bed bug treatment Bangalore",
    "bed bug treatment Delhi",
    "bed bug treatment Noida",
  ],
  verification: {
    google: "WSCksZqN235FUmro6h6sNEW0VRcCF0yDhXzkr-jK-TA",
  },
  openGraph: {
    title: "Bed Bug Treatment — Sleep Peacefully Again",
    description: site.description,
    type: "website",
    locale: "en_IN",
    siteName: site.name,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <head>
        <meta
          name="google-site-verification"
          content="WSCksZqN235FUmro6h6sNEW0VRcCF0yDhXzkr-jK-TA"
        />
        <script
          id="perf-measure-guard"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined' && window.performance && window.performance.measure) {
                  var origMeasure = window.performance.measure.bind(window.performance);
                  window.performance.measure = function(name, startOrOptions, end) {
                    try {
                      if (typeof startOrOptions === 'object' && startOrOptions !== null) {
                        if (typeof startOrOptions.end === 'number' && startOrOptions.end < 0) {
                          startOrOptions.end = Math.max(0, startOrOptions.start || 0);
                        }
                        if (typeof startOrOptions.start === 'number' && startOrOptions.start < 0) {
                          startOrOptions.start = 0;
                        }
                      }
                      return origMeasure(name, startOrOptions, end);
                    } catch (e) {
                      // Silently guard against React 19 / Turbopack DevTools negative timestamp measure bug
                    }
                  };
                }
              })();
            `,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-white">
        <ScrollToTop />
        <MarketingOnly>
          <SiteHeader />
        </MarketingOnly>
        <main className="flex-1 flex flex-col">{children}</main>
        <MarketingOnly>
          <SiteFooter />
          <FloatingForm />
          <FloatingContact />
        </MarketingOnly>
      </body>
    </html>
  );
}
