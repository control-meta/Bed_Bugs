import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FloatingContact } from "@/components/floating-contact";
import { FloatingForm } from "@/components/floating-form";
import { site } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "Bed Bug Treatment in Pune, Mumbai, Bangalore, Delhi & Noida | BedBug Treatment",
    template: "%s | BedBug Treatment",
  },
  description: site.description,
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
    >
      <head>
        <script
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
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <FloatingForm />
        <FloatingContact />
      </body>
    </html>
  );
}
