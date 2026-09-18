import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllLocationSlugs } from "@/lib/locations";
import { getLocationPage } from "@/lib/locations-db";
import { LocationPageContent } from "@/components/location-page-content";
import { getPageSeo, getAllImageAltMap } from "@/lib/seo-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ city: string }>;
};

export async function generateStaticParams() {
  return getAllLocationSlugs().map((slug) => ({
    city: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const location = await getLocationPage(city);

  if (!location) {
    return {
      title: "Location Not Found",
    };
  }

  // Check if there is an explicit override in Global SEO / Meta Data store
  const seoOverride = await getPageSeo(`/${city}`);
  const title = seoOverride?.title || location.title;
  const description = seoOverride?.description || location.metaDescription;

  return {
    title: {
      absolute: title,
    },
    description: description,
    keywords: seoOverride?.keywords && seoOverride.keywords.length > 0 ? seoOverride.keywords : location.keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `https://bedbugstreatment.co.in/${location.slug}`,
    },
    openGraph: {
      title: location.title,
      description: location.metaDescription,
      url: `https://bedbugstreatment.co.in/${location.slug}`,
      siteName: "Bed Bug Treatment India",
      locale: "en_IN",
      type: "website",
    },
  };
}

export default async function LocationCityPage({ params }: Props) {
  const { city } = await params;
  const [location, altMap] = await Promise.all([
    getLocationPage(city),
    getAllImageAltMap(),
  ]);

  if (!location) {
    notFound();
  }

  const allLocalities = (location.coverageAreas || []).flatMap((z) => z.localities || []);

  // Structured Data (JSON-LD) for LocalBusiness / PestControl
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "PestControlService"],
    name: `Bed Bug Treatment ${location.name}`,
    image: location.image || "https://bedbugstreatment.co.in/images/treatment-1.png",
    telephone: location.phone,
    priceRange: "₹1499 - ₹4999",
    url: `https://bedbugstreatment.co.in/${location.slug}`,
    description: location.metaDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: location.name,
      addressRegion: location.state,
      addressCountry: "IN",
    },
    areaServed: allLocalities.map((loc) => ({
      "@type": "AdministrativeArea",
      name: `${loc}, ${location.name}`,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: location.rating,
      reviewCount: (location.reviewCount || "350").replace(/[^0-9]/g, "") || "350",
      bestRating: "5",
      worstRating: "1",
    },
    review: (location.reviews || []).map((r) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: r.name,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: "5",
      },
      reviewBody: r.quote,
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (location.faqs || []).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://bedbugstreatment.co.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: location.name,
        item: `https://bedbugstreatment.co.in/${location.slug}`,
      },
    ],
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Render Location Page Content */}
      <LocationPageContent
        location={location}
        customStyles={location.customStyles}
        altMap={altMap}
      />
    </>
  );
}
