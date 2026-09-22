"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  BugOff,
  PhoneCall,
} from "lucide-react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}
import { locations } from "@/lib/locations";
import { site } from "@/lib/site";
import { OpenFormButton } from "@/components/open-form-button";
import { PopularBadge } from "@/components/popular-badge";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import type { ExtendedLocationInfo, CustomStyles } from "@/lib/locations-db";

export interface LocationPageContentProps {
  location: ExtendedLocationInfo;
  customStyles?: CustomStyles;
  isEditing?: boolean;
  activeFieldId?: string | null;
  onFocusField?: (id: string, label: string, rect: DOMRect) => void;
  onUpdateText?: (id: string, newText: string) => void;
  altMap?: Record<string, string>;
}

interface CustomStylesContextType {
  customStyles?: CustomStyles;
  isEditing?: boolean;
  activeFieldId?: string | null;
  onFocusField?: (id: string, label: string, rect: DOMRect) => void;
  onUpdateText?: (id: string, newText: string) => void;
}

const CustomStylesContext = React.createContext<CustomStylesContextType>({
  customStyles: undefined,
  isEditing: false,
  activeFieldId: null,
});

/**
 * Ensures the hero heading on location pages is formatted for clean responsive display:
 * - Strips messy nested font-size spans created by rich-text editors.
 * - Ensures a clean 2-line structure:
 *     Line 1: "Bed Bug Treatment in" (nowrap on mobile)
 *     Line 2: "[City Name]" (highlighted in emerald brand color)
 */
export function formatLocationHeroHeading(
  raw: string | undefined,
  cityName: string
): string {
  if (!raw || typeof raw !== "string") {
    return `<span class="location-hero-prefix inline-block max-sm:whitespace-nowrap">Bed Bug Treatment in</span><br/><span class="location-hero-city text-brand-600" style="color: rgb(0, 140, 90);">${cityName}</span>`;
  }

  let cleaned = raw.replace(/&nbsp;/g, " ").trim();

  // Strip all nested font-size spans and font tags
  while (/<span\s+style=["'][^"']*font-size:[^"']*["']>/i.test(cleaned)) {
    cleaned = cleaned.replace(
      /<span\s+style=["'][^"']*font-size:[^"']*["']>([\s\S]*?)<\/span>/gi,
      "$1"
    );
  }
  while (/<font\s+size=["'][^"']*["']>/i.test(cleaned)) {
    cleaned = cleaned.replace(/<font\s+size=["'][^"']*["']>([\s\S]*?)<\/font>/gi, "$1");
  }

  // Strip empty spans
  cleaned = cleaned.replace(/<span[^>]*>\s*<\/span>/gi, "").trim();

  // Strip trailing br tags
  cleaned = cleaned.replace(/<br\s*\/?>\s*$/i, "").trim();

  // Ensure <br/> is positioned right before the city span or city name
  if (!/<br\s*\/?>/i.test(cleaned)) {
    if (/(Bed Bug\s+[A-Za-z]+\s+in)\s*(<span[^>]*>.*?<\/span>)/i.test(cleaned)) {
      cleaned = cleaned.replace(
        /(Bed Bug\s+[A-Za-z]+\s+in)\s*(<span[^>]*>.*?<\/span>)/i,
        "$1<br/>$2"
      );
    } else if (cityName && new RegExp(`(Bed Bug\\s+[A-Za-z]+\\s+in)\\s*(${cityName})`, "i").test(cleaned)) {
      cleaned = cleaned.replace(
        new RegExp(`(Bed Bug\\s+[A-Za-z]+\\s+in)\\s*(${cityName})`, "i"),
        `$1<br/><span class="location-hero-city text-brand-600" style="color: rgb(0, 140, 90);">$2</span>`
      );
    }
  }

  // Ensure city span has location-hero-city class for easy targeted styling
  if (!cleaned.includes("location-hero-city")) {
    cleaned = cleaned.replace(
      /<span\s+(style=["'][^"']*color:[^"']*["'])/i,
      '<span class="location-hero-city" $1'
    );
  }

  // Wrap Line 1 prefix in .location-hero-prefix if not wrapped
  if (!cleaned.includes("location-hero-prefix")) {
    if (/(Bed Bug\s+[A-Za-z]+\s+in)/i.test(cleaned)) {
      cleaned = cleaned.replace(
        /(Bed Bug\s+[A-Za-z]+\s+in)/i,
        '<span class="location-hero-prefix inline-block max-sm:whitespace-nowrap">$1</span>'
      );
    }
  }

  return cleaned;
}

/**
 * Direct inline editable text component.
 * - When isEditing = false: Renders clean, production HTML.
 * - When isEditing = true: contentEditable, directly clickable & typeable in-place.
 */
export function EditableItem({
  id,
  label,
  value,
  isEditing: isEditingProp,
  isActive: isActiveProp,
  className = "",
  style = {},
  as: Component = "div",
  children,
}: {
  id: string;
  label: string;
  value?: string;
  isEditing?: boolean;
  isActive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  as?: any;
  children?: React.ReactNode;
}) {
  const context = React.useContext(CustomStylesContext);
  const isEditing = isEditingProp !== undefined ? isEditingProp : context.isEditing;
  const customStyles = context.customStyles;
  const activeFieldId = context.activeFieldId;
  const itemIsActive = isActiveProp !== undefined ? isActiveProp : activeFieldId === id;

  const elementRef = React.useRef<HTMLElement>(null);
  const isFocusedRef = React.useRef(false);

  // Read styling overrides from customStyles
  const customColor =
    customStyles?.[`${id}_color`] ||
    (id === "heroHeading"
      ? customStyles?.heroTitleColor || customStyles?.heroHeading_color
      : undefined) ||
    (id === "heroDescription"
      ? customStyles?.heroDesc_color || customStyles?.heroDescription_color
      : undefined) ||
    (id === "tagline" ? customStyles?.tagline_color : undefined);

  const customSize =
    customStyles?.[`${id}_size`] ||
    (id === "heroHeading"
      ? customStyles?.heroTitleSize || customStyles?.heroHeading_size
      : undefined) ||
    (id === "heroDescription"
      ? customStyles?.heroDesc_size || customStyles?.heroDescription_size
      : undefined) ||
    (id === "tagline" ? customStyles?.tagline_size : undefined);

  const customWeight = customStyles?.[`${id}_weight`];
  const isItalic = customStyles?.[`${id}_italic`];
  const isUnderline = customStyles?.[`${id}_underline`];
  const customAlign = customStyles?.[`${id}_align`];

  let fontSizeCss: string | undefined = undefined;
  if (customSize) {
    const s = String(customSize).trim();
    if (/^\d+(\.\d+)?(px|rem|em|pt|vh|vw)?$/i.test(s)) {
      fontSizeCss = /^[a-z]+$/i.test(s) ? s : s.endsWith("px") || s.endsWith("rem") || s.endsWith("em") ? s : `${s}px`;
    }
  }

  const mergedStyle: React.CSSProperties = {
    ...style,
    ...(customColor ? { color: customColor } : {}),
    ...(fontSizeCss ? { fontSize: fontSizeCss } : {}),
    ...(customWeight ? { fontWeight: customWeight } : {}),
    ...(isItalic ? { fontStyle: "italic" } : {}),
    ...(isUnderline ? { textDecoration: "underline" } : {}),
    ...(customAlign
      ? {
        textAlign: customAlign,
        display: Component === "span" ? "inline-block" : undefined,
      }
      : {}),
  };

  // If Component is passed as "p", always render as "div" to safely support rich HTML formatting,
  // newlines, and nested tags without violating HTML5 parser rules or causing hydration mismatch.
  const EffectiveComponent = Component === "p" ? "div" : Component;

  function cleanHtml(raw: any): string {
    if (typeof raw !== "string") return "";
    let cleaned = raw
      .replace(/<font\s+color=["'](.*?)["']>(.*?)<\/font>/gi, '<span style="color: $1">$2</span>')
      .replace(/<font\s+size=["'](.*?)["']>(.*?)<\/font>/gi, '<span style="font-size: $1">$2</span>');

    // If rendering inside an inline <span> tag, strip any block tags so it never breaks parent elements
    if (EffectiveComponent === "span") {
      cleaned = cleaned.replace(/<\/?(div|p|ul|ol|li|h[1-6]|blockquote|section)[^>]*>/gi, "");
    }
    return cleaned;
  }

  // Sync with value changes when not actively focused or active (e.g. discarding or loading city)
  const isInitializedRef = React.useRef(false);

  React.useEffect(() => {
    if (elementRef.current) {
      const target = cleanHtml(value !== undefined ? value : typeof children === "string" ? children : "");
      if (!isInitializedRef.current) {
        elementRef.current.innerHTML = target;
        isInitializedRef.current = true;
      } else if (!isFocusedRef.current && !itemIsActive) {
        if (elementRef.current.innerHTML !== target) {
          elementRef.current.innerHTML = target;
        }
      }
    }
  }, [value, children, itemIsActive]);

  if (!isEditing) {
    const cleaned = cleanHtml(typeof value === "string" ? value : typeof children === "string" ? children : "");
    const hasHtml = Boolean(cleaned && cleaned.includes("<") && cleaned.includes(">"));

    return (
      <EffectiveComponent
        data-field-id={id}
        className={className}
        style={mergedStyle}
        suppressHydrationWarning={true}
        {...(hasHtml ? { dangerouslySetInnerHTML: { __html: cleaned } } : {})}
      >
        {hasHtml ? undefined : (children ?? value)}
      </EffectiveComponent>
    );
  }

  // EDITING MODE: User clicks directly on text and types in-place with real-time rich-text support
  // No dangerouslySetInnerHTML or React children here so React reconciler never destroys active text selection
  return (
    <EffectiveComponent
      data-field-id={id}
      ref={elementRef}
      contentEditable={true}
      suppressContentEditableWarning={true}
      suppressHydrationWarning={true}
      onFocus={(e: React.FocusEvent<HTMLElement>) => {
        isFocusedRef.current = true;
        const rect = e.currentTarget.getBoundingClientRect();
        context.onFocusField?.(id, label, rect);
      }}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        isFocusedRef.current = true;
        const rect = e.currentTarget.getBoundingClientRect();
        context.onFocusField?.(id, label, rect);
      }}
      onInput={(e: React.FormEvent<HTMLElement>) => {
        const text = e.currentTarget.innerHTML;
        context.onUpdateText?.(id, text);
      }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        isFocusedRef.current = false;
        const text = e.currentTarget.innerHTML;
        context.onUpdateText?.(id, text);
      }}
      onPaste={(e: React.ClipboardEvent<HTMLElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
      }}
      className={`transition-all duration-150 cursor-text outline-none ${className} ${itemIsActive
        ? "outline outline-2 outline-emerald-600 outline-offset-2 ring-2 ring-emerald-500/20 bg-emerald-50/25 rounded-sm"
        : "hover:outline hover:outline-dashed hover:outline-emerald-400/80 hover:outline-offset-2 hover:bg-emerald-50/15 rounded-sm"
        }`}
      style={mergedStyle}
      title={`Click to edit: ${label}`}
    />
  );
}

const oneTimeFeatures = [
  "Detailed inspection",
  "Targeted bed bug treatment",
  "Treatment of identified hiding areas",
  "Post-treatment guidance",
  "Suitable for homes, apartments, hotels and offices",
];

const amcFeatures = [
  "Initial inspection and treatment",
  "3 scheduled visits over 12 months",
  "Follow-up treatment visits",
  "Monitoring for recurring activity",
];

const ctaImagesRow1 = [
  {
    src: "/images/treatment-1.png",
    alt: "Family sleeping peacefully after professional bed bug treatment",
  },
  {
    src: "/images/treatment-2.png",
    alt: "Certified technician carrying out a bed bug inspection",
  },
  {
    src: "/images/services/service-spray.jpg",
    alt: "Targeted bed bug spray treatment",
  },
  {
    src: "/images/services/service-deep-treatment.jpg",
    alt: "Targeted advanced bed bug treatment",
  },
];

const ctaImagesRow2 = [
  {
    src: "/images/services/service-eco.jpg",
    alt: "Eco-friendly bed bug treatment",
  },
  {
    src: "/images/services/fully-equipped.jpg",
    alt: "Fully equipped bed bug extermination",
  },
  {
    src: "/images/services/service-warranty.jpg",
    alt: "Professional bed bug warranty",
  },
  {
    src: "/images/hero-tech-bed.webp",
    alt: "Targeted bed bug treatment for your home",
  },
];

export function LocationPageContent({
  location,
  customStyles,
  isEditing = false,
  activeFieldId,
  onFocusField,
  onUpdateText,
  altMap = {},
}: LocationPageContentProps) {
  const fontFamilyStyle = customStyles?.fontFamily
    ? { fontFamily: customStyles.fontFamily }
    : {};

  // FAQ Accordion local state for interactive expand/collapse
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [visibleFaqCount, setVisibleFaqCount] = useState<number>(3);

  const phone = (location.phone || "919769321234").replace(/[^0-9]/g, "");

  const oneTimeHref = `https://wa.me/${phone}?text=${encodeURIComponent(
    `Hi, I want to book the One-Time Bed Bug Treatment in ${location.name}. Please share the details.`
  )}`;

  const amcHref = `https://wa.me/${phone}?text=${encodeURIComponent(
    `Hi, I want to choose the 1-Year Bed Bug AMC in ${location.name}. Please share the details.`
  )}`;

  const faqs = location.faqs || [];
  const visibleFaqs = faqs.slice(0, visibleFaqCount);
  const hasMoreFaqs = visibleFaqCount < faqs.length;

  return (
    <CustomStylesContext.Provider
      value={{
        customStyles,
        isEditing,
        activeFieldId,
        onFocusField,
        onUpdateText,
      }}
    >
      <div
        style={fontFamilyStyle}
        className="min-h-screen bg-white text-ink selection:bg-brand-500 selection:text-white w-full overflow-x-hidden"
      >
        {/* 1. City Hero Section */}
        <section
          id="hero-section"
          className="relative isolate overflow-hidden bg-cream pb-8 pt-24 max-sm:pb-6 max-sm:pt-24 lg:pb-10 lg:pt-24"
        >
          {/* Background City Skyline & Atmosphere */}
          <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
            {location.image ? (
              <Image
                src={location.image}
                alt={
                  altMap?.[location.image] ||
                  `Bed bug pest control and eradication service coverage in ${location.name}`
                }
                fill
                priority
                sizes="100vw"
                className="object-cover object-center scale-105"
              />
            ) : (
              <div className="h-full w-full bg-slate-200" />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/92 to-cream/35 max-lg:bg-gradient-to-b max-lg:from-cream/95 max-lg:via-cream/85 max-lg:to-cream/45" />
            <div className="absolute inset-0 bg-grid-light opacity-25" />
            <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-brand-400/15 blur-3xl" />
            <div className="absolute -right-20 top-12 h-96 w-96 rounded-full bg-accent-400/15 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
              {/* Left Content Column */}
              <div className="text-center lg:col-span-7 lg:text-left">
                {/* City Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-800">
                  <MapPin className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                  <EditableItem
                    id="cityBadge"
                    label="City Top Badge"
                    value={
                      customStyles?.cityBadge ||
                      `Verified Bed Bug Specialists in ${location.name}, ${location.state}`
                    }
                    as="span"
                  />
                </div>

                {/* Main Heading */}
                <div className="mt-3.5">
                  <EditableItem
                    id="heroHeading"
                    label="Hero Heading"
                    value={formatLocationHeroHeading(
                      customStyles?.heroHeading || location.heroHeading,
                      location.name
                    )}
                    as="h1"
                    className="location-hero-heading font-display text-[1.65rem] font-extrabold leading-[1.22] tracking-tight text-ink sm:text-4xl md:text-5xl lg:text-[3rem] sm:leading-tight"
                  />
                </div>

                {/* Tagline / Subtitle */}
                <div className="mt-2">
                  <EditableItem
                    id="tagline"
                    label="Tagline"
                    value={customStyles?.tagline || location.tagline}
                    as="p"
                    className="text-base font-semibold text-brand-800 sm:text-lg"
                  />
                </div>

                {/* Mobile Card Visual */}
                <div className="my-5 flex w-full justify-center lg:hidden">
                  <div className="relative aspect-[16/10] w-full max-w-sm overflow-hidden rounded-2xl border-2 border-white bg-white shadow-xl shadow-brand-900/10 ring-1 ring-black/5 sm:max-w-md">
                    {location.image && (
                      <Image
                        src={location.image}
                        alt={
                          altMap?.[location.image] ||
                          `Bed bug inspection and extermination unit serving ${location.name}`
                        }
                        fill
                        priority
                        sizes="(max-width: 1023px) 90vw, 40vw"
                        className="object-cover object-center"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />


                    <div className="absolute bottom-2.5 left-3 right-3 text-center text-white sm:text-left">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                        {location.state} • Pan-{location.name} Service
                      </p>
                      <h3 className="font-display text-base font-bold leading-tight drop-shadow-sm">
                        {location.name} Pest Control Hub
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Hero Description - Desktop Only */}
                <div className="hidden mt-2.5 max-w-2xl lg:block">
                  <EditableItem
                    id="heroDescription"
                    label="Hero Description"
                    value={customStyles?.heroDescription || location.heroDescription}
                    as="p"
                    className="text-sm leading-relaxed text-ink/70 sm:text-base"
                  />
                </div>

                {/* Metric Stats Pills */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 lg:mt-6 lg:justify-center">
                  <div className="inline-flex items-center gap-1.5 rounded-xl border border-ink/10 bg-white/90 px-3 py-1.5 text-xs font-medium text-ink shadow-sm backdrop-blur-sm">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-brand-600" />
                    <span>
                      <EditableItem
                        id="responseTime"
                        label="Response Time"
                        value={location.responseTime}
                        as="strong"
                        className="font-semibold"
                      />
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-xl border border-ink/10 bg-white/90 px-3 py-1.5 text-xs font-medium text-ink shadow-sm backdrop-blur-sm">
                    <Home className="h-3.5 w-3.5 shrink-0 text-brand-600" />
                    <span>
                      Homes:{" "}
                      <EditableItem
                        id="homesTreated"
                        label="Homes Treated"
                        value={location.homesTreated}
                        as="strong"
                        className="font-semibold"
                      />
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-xl border border-ink/10 bg-white/90 px-3 py-1.5 text-xs font-medium text-ink shadow-sm backdrop-blur-sm">
                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                    <span>
                      Rating:{" "}
                      <EditableItem
                        id="rating"
                        label="Rating Score"
                        value={location.rating}
                        as="strong"
                        className="font-semibold"
                      />{" "}
                      ({location.reviewCount})
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-center">
                  {isEditing ? (
                    <div className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-brand-600/25 max-sm:w-full cursor-pointer">
                      <CalendarCheck className="h-4 w-4" />
                      <EditableItem
                        id="btnBookText"
                        label="Book Button Text"
                        value={
                          customStyles?.btnBookText ||
                          `Book Bed Bug Treatment in ${location.name}`
                        }
                        as="span"
                      />
                    </div>
                  ) : (
                    <OpenFormButton
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-500 hover:shadow-brand-600/35 max-sm:w-full"
                      ariaLabel={`Book Bed Bug Treatment in ${location.name}`}
                    >
                      <CalendarCheck className="h-4 w-4" />
                      <span>
                        {customStyles?.btnBookText ||
                          `Book Bed Bug Treatment in ${location.name}`}
                      </span>
                    </OpenFormButton>
                  )}

                  <a
                    href={site.phoneHref}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-3 text-xs font-semibold text-ink shadow-sm transition hover:border-brand-600 hover:text-brand-700 max-sm:w-full"
                  >
                    <Phone className="h-3.5 w-3.5 text-brand-600" />
                    <EditableItem
                      id="btnCallText"
                      label="Call Button Text"
                      value={customStyles?.btnCallText || `Call Now: ${location.phoneDisplay}`}
                      as="span"
                    />
                  </a>

                  <a
                    href={`https://wa.me/${location.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      location.whatsappText,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 px-5 py-3 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 max-sm:w-full"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                    <EditableItem
                      id="btnWhatsappText"
                      label="WhatsApp Button Text"
                      value={customStyles?.btnWhatsappText || "WhatsApp"}
                      as="span"
                    />
                  </a>
                </div>
              </div>

              {/* Desktop Right Column: Large City Image Showcase Card */}
              <div className="relative mx-auto hidden w-full max-w-lg lg:col-span-5 lg:block lg:max-w-none">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-2xl shadow-brand-900/10 ring-1 ring-black/5">
                  {location.image && (
                    <Image
                      src={location.image}
                      alt={
                        altMap?.[location.image] ||
                        `Certified bed bug treatment specialists operating in ${location.name}`
                      }
                      fill
                      priority
                      sizes="(min-width: 1024px) 40vw, 90vw"
                      className="object-cover object-center transition-transform duration-700 hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />





                  {/* Bottom Overlay Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-semibold tracking-wider uppercase text-emerald-300 drop-shadow-sm">
                      {location.state} • Pan-{location.name} Service
                    </p>
                    <h3 className="font-display text-xl font-bold leading-tight drop-shadow-md sm:text-2xl">
                      {location.name} Pest Control Hub
                    </h3>
                    <p className="mt-1 text-xs text-white/80 font-medium">
                      {location.activeTechnicians} Active on Duty Today
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Local Highlights & City Context */}
        <section className="bg-white py-8 lg:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <p className="flex items-center font-semibold uppercase gap-2.5 text-[11px] tracking-[0.22em] text-brand-600">
                <span className="h-px bg-current w-6" />
                <EditableItem
                  id="highlightsEyebrow"
                  label="Highlights Eyebrow"
                  value={customStyles?.highlightsEyebrow || `Why ${location.name} Trusts Us`}
                  as="span"
                />
                <span className="h-px bg-current w-6" />
              </p>
              <EditableItem
                id="highlightsTitle"
                label="Highlights Section Title"
                value={
                  customStyles?.highlightsTitle ||
                  `Tailored bed bug solutions for ${location.name} homes & societies`
                }
                as="h2"
                className="max-w-3xl font-display font-extrabold tracking-tight mt-3 text-2xl sm:text-3xl lg:text-4xl text-ink"
              />
              <EditableItem
                id="highlightsDesc"
                label="Highlights Section Description"
                value={
                  customStyles?.highlightsDesc ||
                  `Every city has unique housing structures and pest patterns. Here is how our localized ${location.name} team ensures 100% bug-free results.`
                }
                as="p"
                className="max-w-2xl leading-relaxed mt-4 text-sm text-ink/65"
              />
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(location.localHighlights || []).map((highlight, idx) => (
                <div
                  key={idx}
                  className="group relative flex flex-col justify-between rounded-2xl border border-ink/10 bg-cream/30 p-6 text-center transition duration-300 hover:border-brand-600/30 hover:bg-white hover:shadow-xl hover:shadow-brand-600/5 sm:text-left"
                >
                  <div>
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/10 text-brand-600 sm:mx-0">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <EditableItem
                      id={`highlight-${idx}-title`}
                      label={`Highlight #${idx + 1} Title`}
                      value={highlight.title}
                      as="h3"
                      className="mt-4 font-display text-lg font-bold text-ink"
                    />
                    <EditableItem
                      id={`highlight-${idx}-desc`}
                      label={`Highlight #${idx + 1} Description`}
                      value={highlight.description}
                      as="p"
                      className="mt-2 text-sm leading-relaxed text-ink/70"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-700 sm:justify-start">
                    <CheckCircle2 className="h-4 w-4 text-brand-600" />
                    <EditableItem
                      id={`highlight-${idx}-guarantee`}
                      label={`Highlight #${idx + 1} Guarantee`}
                      value={
                        customStyles?.[`highlight-${idx}-guarantee`] ||
                        `Guaranteed in ${location.name}`
                      }
                      as="span"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* 5. Bed Bug Treatment Options Section */}
        <section
          id="treatment-options"
          className="bg-white pt-3 pb-3 sm:pt-4 sm:pb-4 lg:pt-6 lg:pb-4 scroll-mt-16"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-600">
                <span className="h-px w-8 bg-brand-600/60" />
                <EditableItem
                  id="treatmentEyebrow"
                  label="Treatment Eyebrow"
                  value={customStyles?.treatmentEyebrow || "BED BUG TREATMENT OPTIONS"}
                  as="span"
                />
                <span className="h-px w-8 bg-brand-600/60" />
              </div>
              <EditableItem
                id="treatmentTitle"
                label="Treatment Title"
                value={customStyles?.treatmentTitle || "One-Time Treatment or 1-Year AMC"}
                as="h2"
                className="mt-3 font-display text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl"
              />
              <EditableItem
                id="treatmentDesc"
                label="Treatment Description"
                value={
                  customStyles?.treatmentDesc ||
                  "Choose the service plan that best fits your bed bug problem. A one-time treatment is suitable for immediate treatment needs, while our 1-Year AMC provides three visits over 12 months for continued protection."
                }
                as="p"
                className="mx-auto mt-3 max-w-3xl text-xs sm:text-sm text-ink/70 leading-relaxed"
              />
            </div>

            <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 sm:mt-10 md:grid-cols-2 lg:gap-8">
              {/* Card 1: One-Time Bed Bug Treatment */}
              <article className="relative flex flex-col rounded-2xl border border-[#d9e9e2] bg-[#fdfffe] shadow-sm transition hover:shadow-md">
                <div className="flex items-center gap-4 rounded-t-2xl px-6 pb-4 pt-6 sm:px-7">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(ellipse_at_center,#c9eddd,#f0fcf6_70%)] text-[#008c5a]">
                    <Home className="h-7 w-7" />
                  </span>
                  <div>
                    <EditableItem
                      id="plan1_title"
                      label="Plan 1 Title"
                      value={customStyles?.plan1_title || "One-Time Bed Bug Treatment"}
                      as="h3"
                      className="font-display text-base font-bold text-[#146d51] sm:text-lg"
                    />
                    <EditableItem
                      id="plan1_sub"
                      label="Plan 1 Subtitle"
                      value={customStyles?.plan1_sub || "For immediate treatment needs"}
                      as="p"
                      className="mt-0.5 text-xs text-[#2c916d] sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col px-6 pb-6 sm:px-7">
                  <ul className="flex-1 space-y-3">
                    {oneTimeFeatures.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <span className="mt-0.5 flex shrink-0 items-center justify-center text-[#06734d]">
                          <Check className="h-4 w-4 stroke-[2.5]" />
                        </span>
                        <EditableItem
                          id={`plan1_feat_${fIdx}`}
                          label={`Plan 1 Feature #${fIdx + 1}`}
                          value={customStyles?.[`plan1_feat_${fIdx}`] || feature}
                          as="span"
                          className="text-xs text-ink/80 sm:text-sm"
                        />
                      </li>
                    ))}
                  </ul>

                  <a
                    href={oneTimeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex w-full items-center justify-center rounded-lg bg-[#06734d] px-4 py-3 text-center font-display text-sm font-bold text-white shadow-sm transition hover:brightness-110 active:scale-[0.99]"
                  >
                    <EditableItem
                      id="plan1_btn"
                      label="Plan 1 Button Text"
                      value={customStyles?.plan1_btn || "Book One-Time via WhatsApp"}
                      as="span"
                    />
                  </a>
                </div>
              </article>

              {/* Card 2: 1-Year AMC */}
              <article className="relative flex flex-col rounded-2xl border border-[#06734d] bg-[#fdfffe] shadow-sm transition hover:shadow-md">
                <PopularBadge />

                <div className="flex items-center gap-4 rounded-t-2xl bg-[#06734d] px-6 pb-5 pt-7 sm:px-7">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[#06734d]">
                    <CalendarCheck className="h-7 w-7" />
                  </span>
                  <div>
                    <EditableItem
                      id="plan2_title"
                      label="Plan 2 Title"
                      value={customStyles?.plan2_title || "1-Year Bed Bug AMC"}
                      as="h3"
                      className="font-display text-base font-bold text-white sm:text-lg"
                    />
                    <EditableItem
                      id="plan2_sub"
                      label="Plan 2 Subtitle"
                      value={customStyles?.plan2_sub || "Long-term warranty coverage"}
                      as="p"
                      className="mt-0.5 text-xs text-[#a3e2c9] sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col px-6 pb-6 pt-5 sm:px-7">
                  <ul className="flex-1 space-y-3">
                    {amcFeatures.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <span className="mt-0.5 flex shrink-0 items-center justify-center text-[#06734d]">
                          <Check className="h-4 w-4 stroke-[2.5]" />
                        </span>
                        <EditableItem
                          id={`plan2_feat_${fIdx}`}
                          label={`Plan 2 Feature #${fIdx + 1}`}
                          value={customStyles?.[`plan2_feat_${fIdx}`] || feature}
                          as="span"
                          className="text-xs text-ink/80 sm:text-sm"
                        />
                      </li>
                    ))}
                  </ul>

                  <a
                    href={amcHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex w-full items-center justify-center rounded-lg bg-[#06734d] px-4 py-3 text-center font-display text-sm font-bold text-white shadow-sm transition hover:brightness-110 active:scale-[0.99]"
                  >
                    <EditableItem
                      id="plan2_btn"
                      label="Plan 2 Button Text"
                      value={customStyles?.plan2_btn || "Choose 1-Year AMC"}
                      as="span"
                    />
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* 3. Localities & Neighborhoods Coverage */}
        <section id="coverage-zones" className="bg-cream/50 pt-8 pb-4 lg:pt-10 lg:pb-5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <p className="flex items-center font-semibold uppercase gap-2.5 text-[11px] tracking-[0.22em] text-brand-600">
                <span className="h-px bg-current w-6" />
                <EditableItem
                  id="coverageEyebrow"
                  label="Coverage Eyebrow"
                  value={customStyles?.coverageEyebrow || "Coverage Zones"}
                  as="span"
                />
                <span className="h-px bg-current w-6" />
              </p>
              <EditableItem
                id="coverageTitle"
                label="Coverage Title"
                value={
                  customStyles?.coverageTitle ||
                  `Neighborhoods we cover across ${location.name}`
                }
                as="h2"
                className="max-w-3xl font-display font-extrabold tracking-tight mt-3 text-2xl sm:text-3xl lg:text-4xl text-ink"
              />
              <EditableItem
                id="coverageDesc"
                label="Coverage Description"
                value={
                  customStyles?.coverageDesc ||
                  `Our mobile extermination units are stationed across all key zones in ${location.name} to ensure same-day arrival within ${location.responseTime}.`
                }
                as="p"
                className="max-w-2xl leading-relaxed mt-4 text-sm text-ink/65"
              />
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(location.coverageAreas || []).map((area, idx) => (
                <div
                  key={idx}
                  className="flex flex-col rounded-2xl border border-ink/10 bg-white p-6 text-center shadow-sm transition hover:border-brand-500/40 sm:text-left"
                >
                  <div className="flex flex-col items-center gap-3 border-b border-ink/10 pb-4 text-center sm:flex-row sm:text-left">
                    <span className="mx-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600/10 text-brand-600 sm:mx-0">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <EditableItem
                        id={`zone-${idx}-title`}
                        label={`Zone #${idx + 1} Title`}
                        value={area.zone}
                        as="h3"
                        className="font-display text-base font-bold text-ink"
                      />
                      <p className="text-xs text-ink/50">
                        {area.localities.length} major localities covered
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                    {area.localities.map((locality, lIdx) => (
                      <EditableItem
                        key={lIdx}
                        id={`zone-${idx}-loc-${lIdx}`}
                        label={`Locality ${locality}`}
                        value={locality}
                        as="span"
                        className="inline-flex items-center rounded-lg border border-ink/5 bg-cream/70 px-2.5 py-1 text-xs font-medium text-ink/80 transition hover:border-brand-500/30 hover:bg-brand-50 hover:text-brand-700"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-brand-500/20 bg-brand-50/50 p-5 text-center">
              <EditableItem
                id="coverageNoteText"
                label="Coverage Footer Note"
                value={
                  customStyles?.coverageNoteText ||
                  `Don't see your specific sector or colony listed? We service all residential and commercial addresses within 45 km of ${location.name} center.`
                }
                as="div"
                className="text-xs font-medium text-ink/80 sm:text-sm"
              />

            </div>
          </div>
        </section>

        {/* 6. Customer Reviews Section (Original Marquee Carousel + Editable Headings) */}
        <TestimonialsSection
          id="local-reviews"
          className="relative overflow-hidden bg-white pt-2 pb-4 sm:pt-3 sm:pb-5 lg:pt-4 lg:pb-6"
          eyebrow={
            <EditableItem
              id="reviewsEyebrow"
              label="Reviews Eyebrow"
              value={customStyles?.reviewsEyebrow || "Local Customer Reviews"}
              as="span"
            />
          }
          title={
            <EditableItem
              id="reviewsTitle"
              label="Reviews Section Title"
              value={
                customStyles?.reviewsTitle ||
                `Rated ${location.rating} in ${location.name}`
              }
              as="span"
            />
          }
          description={
            <EditableItem
              id="reviewsDesc"
              label="Reviews Section Description"
              value={
                customStyles?.reviewsDesc ||
                `Real reviews from homeowners, tenants, and property managers in ${location.name} who became 100% bed bug-free.`
              }
              as="span"
            />
          }
          rating={location.rating}
          reviewCount={location.reviewCount}
          testimonials={location.reviews}
          city={location.name}
          pageSlug={`/${location.slug}`}
        />

        {/* 7. Local FAQs Section (Original Accordion with In-Place Editable Content) */}
        <section className="bg-cream/40 pt-5 pb-3 sm:pt-6 sm:pb-3.5 lg:pt-6 lg:pb-4">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <p className="flex items-center font-semibold uppercase gap-2.5 text-[11px] tracking-[0.22em] text-brand-600">
                <span className="h-px bg-current w-6" />
                <EditableItem
                  id="faqsEyebrow"
                  label="FAQs Eyebrow"
                  value={customStyles?.faqsEyebrow || "Local Questions"}
                  as="span"
                />
                <span className="h-px bg-current w-6" />
              </p>
              <EditableItem
                id="faqsTitle"
                label="FAQs Section Title"
                value={
                  customStyles?.faqsTitle ||
                  `Frequently asked questions in ${location.name}`
                }
                as="h2"
                className="max-w-3xl font-display font-extrabold tracking-tight mt-3 text-2xl sm:text-3xl lg:text-4xl text-ink"
              />
              <EditableItem
                id="faqsDesc"
                label="FAQs Section Description"
                value={
                  customStyles?.faqsDesc ||
                  `Answers to common questions about bed bug extermination, society permissions, and safety in ${location.name}.`
                }
                as="p"
                className="max-w-2xl leading-relaxed mt-4 text-sm text-ink/65"
              />
            </div>

            <div className="mt-8">
              <div className="space-y-3">
                {visibleFaqs.map((faq, idx) => {
                  const isOpen = isEditing ? true : openFaqIndex === idx;

                  return (
                    <div
                      key={idx}
                      className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${isOpen
                        ? "border-brand-600/30 shadow-lg shadow-brand-600/5"
                        : "border-ink/10 hover:border-brand-600/20"
                        }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (!isEditing) {
                            setOpenFaqIndex(openFaqIndex === idx ? null : idx);
                          }
                        }}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-[15px] font-semibold text-ink"
                      >
                        <EditableItem
                          id={`faq-${idx}-q`}
                          label={`FAQ #${idx + 1} Question`}
                          value={faq.question}
                          as="span"
                          className="flex-1"
                        />
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600/10 text-brand-600 transition-transform duration-300 ${isOpen ? "rotate-45 bg-brand-600 text-white" : ""
                            }`}
                        >
                          <Plus className="h-4 w-4" />
                        </span>
                      </button>

                      <div
                        className={`grid transition-all duration-300 ease-out ${isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                          }`}
                      >
                        <div className="overflow-hidden">
                          <div className="border-t border-ink/10 px-5 pb-4 pt-3 text-sm leading-relaxed text-ink/60">
                            <EditableItem
                              id={`faq-${idx}-a`}
                              label={`FAQ #${idx + 1} Answer`}
                              value={faq.answer}
                              as="p"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {faqs.length > 3 && (
                  <div className="pt-1 text-center">
                    {hasMoreFaqs ? (
                      <button
                        type="button"
                        onClick={() =>
                          setVisibleFaqCount((c) => Math.min(c + 3, faqs.length))
                        }
                        className="mt-2 inline-flex items-center gap-2 rounded-full border border-brand-600/25 bg-white px-5 py-2.5 text-sm font-semibold text-brand-600 transition hover:border-brand-600 hover:bg-brand-600 hover:text-white"
                      >
                        Load more
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setVisibleFaqCount(3)}
                        className="mt-2 inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink/60 transition hover:border-brand-600/40 hover:text-brand-600"
                      >
                        Show less
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 8. Other Service Locations Section */}
        <section className="border-t border-ink/10 bg-white pt-6 pb-2 lg:pt-8 lg:pb-3">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <EditableItem
                id="otherCitiesTitle"
                label="Other Cities Title"
                value={
                  customStyles?.otherCitiesTitle || "Looking for service in other cities?"
                }
                as="h3"
                className="font-display text-lg font-bold text-ink"
              />
              <EditableItem
                id="otherCitiesDesc"
                label="Other Cities Description"
                value={
                  customStyles?.otherCitiesDesc ||
                  "We provide identical guaranteed service across all major metropolitan hubs:"
                }
                as="p"
                className="mt-1 text-xs text-ink/60"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {locations
                .filter((l) => l.slug !== location.slug)
                .map((otherCity) => (
                  <Link
                    key={otherCity.slug}
                    href={isEditing ? "#" : `/${otherCity.slug}`}
                    onClick={(e) => {
                      if (isEditing) e.preventDefault();
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-ink/10 bg-cream/40 px-4 py-2 text-xs font-medium text-ink transition hover:border-brand-600/30 hover:bg-brand-50 hover:text-brand-700"
                  >
                    <MapPin className="h-3.5 w-3.5 text-brand-600" />
                    <span>Bed Bug Treatment in {otherCity.name}</span>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* 9. Bottom CTA Section (Original High-Converting Card) */}
        <section className="bg-white pt-2 pb-10 max-sm:pt-1 max-sm:pb-4 lg:pt-3 lg:pb-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[2rem] bg-ink max-sm:rounded-[1.5rem] max-sm:ring-1 max-sm:ring-white/10">
              <div className="absolute inset-0 bg-[radial-gradient(110%_140%_at_15%_10%,#14532d_0%,#0b2e1f_45%,#08160f_80%)]" />
              <div className="absolute inset-0 bg-grid-dark opacity-20" aria-hidden />

              <div className="relative grid items-center gap-8 max-sm:gap-2 lg:grid-cols-2">
                <div className="px-7 pb-6 pt-8 max-sm:px-6 max-sm:pb-2 max-sm:pt-6 max-sm:text-center sm:px-10 lg:py-10">
                  <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand-300 max-sm:justify-center max-sm:text-[0.65rem] max-sm:tracking-[0.2em]">
                    <span className="h-px w-8 bg-brand-500" />
                    <EditableItem
                      id="ctaEyebrow"
                      label="CTA Eyebrow"
                      value={customStyles?.ctaEyebrow || "BOOK YOUR BED BUG TREATMENT"}
                      as="span"
                    />
                  </p>
                  <div className="mt-4 font-display text-xl font-extrabold leading-tight tracking-tight text-white max-sm:mt-3 max-sm:text-[1.2rem] sm:text-2xl lg:text-[1.95rem] xl:text-[2.2rem]">
                    <EditableItem
                      id="ctaTitle"
                      label="CTA Title"
                      value={
                        customStyles?.ctaTitle &&
                          !customStyles.ctaTitle.includes("Same-day service available across")
                          ? customStyles.ctaTitle
                          : "Take Back Your Home From Bed Bugs."
                      }
                      as="span"
                      className="[&>span:last-child]:text-brand-300"
                    >
                      {customStyles?.ctaTitle &&
                        customStyles.ctaTitle !== "Take Back Your Home From Bed Bugs." &&
                        !customStyles.ctaTitle.includes("Same-day service available across") ? (
                        customStyles.ctaTitle
                      ) : (
                        <>
                          <span className="block whitespace-nowrap">Take Back Your</span>
                          <span className="block whitespace-nowrap">
                            Home From <span className="text-brand-300">Bed Bugs.</span>
                          </span>
                        </>
                      )}
                    </EditableItem>
                  </div>
                  <EditableItem
                    id="ctaDesc"
                    label="CTA Description"
                    value={
                      customStyles?.ctaDesc &&
                        !customStyles.ctaDesc.includes("Schedule your Targeted bed bug treatment across") &&
                        !customStyles.ctaDesc.includes("Targeted bed bug treatment across Mumbai")
                        ? customStyles.ctaDesc
                        : `Professional, odorless treatment designed to target bed bugs in mattresses, bed frames, furniture, cracks, and other hiding areas.`
                    }
                    as="p"
                    className="mt-4 max-w-lg text-sm leading-relaxed text-white/85 max-sm:mx-auto max-sm:mt-3 max-sm:text-[0.8rem]"
                  />

                  <div className="mt-6 flex flex-col items-center gap-3 max-sm:mt-5 sm:flex-row sm:justify-center sm:gap-2.5">
                    {isEditing ? (
                      <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-3.5 text-[13px] font-semibold text-brand-700 shadow-xl shadow-black/10 transition hover:bg-white/90 max-sm:w-full max-sm:py-3 max-sm:text-sm cursor-pointer shrink-0">
                        <PhoneCall className="h-4 w-4 shrink-0" />
                        <EditableItem
                          id="ctaBtnBook"
                          label="CTA Book Button"
                          value={customStyles?.ctaBtnBook || `Call ${site.phoneDisplay}`}
                          as="span"
                        />
                      </div>
                    ) : (
                      <a
                        href={site.phoneHref}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-3.5 text-[13px] font-semibold text-brand-700 shadow-xl shadow-black/10 transition hover:bg-white/90 max-sm:w-full max-sm:py-3 max-sm:text-sm shrink-0"
                        title="Call Us"
                        aria-label="Call Us"
                      >
                        <PhoneCall className="h-4 w-4 shrink-0" />
                        <span>
                          {customStyles?.ctaBtnBook || `Call ${site.phoneDisplay}`}
                        </span>
                      </a>
                    )}

                    <a
                      href={site.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/40 px-4 py-3.5 text-[13px] font-semibold text-white transition hover:border-white/70 hover:bg-white/10 max-sm:w-full max-sm:py-3 max-sm:text-sm shrink-0"
                      title="WhatsApp Us"
                      aria-label="WhatsApp Us"
                    >
                      <WhatsAppIcon className="h-4.5 w-4.5 shrink-0" />
                      {Boolean(customStyles?.ctaBtnWhatsapp) && (
                        <EditableItem
                          id="ctaBtnWhatsapp"
                          label="CTA WhatsApp Button"
                          value={customStyles?.ctaBtnWhatsapp}
                          as="span"
                        />
                      )}
                      {(!isEditing || !customStyles?.ctaBtnWhatsapp) && (
                        <span>WhatsApp Us Now</span>
                      )}
                    </a>
                  </div>
                  <p className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-white/80 max-sm:hidden max-sm:mt-4">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-brand-300" />
                    One-Time Treatment & 1-Year AMC Available.
                  </p>
                </div>

                {/* Right Image Slider Showcase */}
                <div className="relative h-64 w-full overflow-hidden max-sm:h-40 sm:h-80 lg:h-full lg:min-h-[22rem]">
                  <div className="absolute left-4 top-0 z-20 flex flex-col items-center justify-center rounded-b-full bg-[#CC2027] px-3 pb-3 pt-2 text-white shadow-xl lg:left-8">
                    <span className="text-center text-[10px] font-extrabold leading-[1.1] tracking-wider sm:text-[12px]">
                      BED BUG<br />FREE
                    </span>
                    <div className="mt-1.5 flex items-center justify-center rounded-full bg-white p-1">
                      <BugOff className="h-5 w-5 text-[#CC2027] sm:h-6 sm:w-6" />
                    </div>
                  </div>
                  {ctaImagesRow1.map((image, index) => (
                    <div
                      key={image.src}
                      className="absolute inset-0 animate-cta-slide will-change-transform"
                      style={{
                        animationDelay: `-${(ctaImagesRow1.length - index) * 5}s`,
                      }}
                    >
                      <Image
                        src={image.src}
                        alt={altMap?.[image.src] || image.alt}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover object-center lg:[mask-image:linear-gradient(to_right,transparent,black_18%)]"
                      />
                    </div>
                  ))}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-ink/40" />

                  <div className="absolute bottom-6 left-1/2 z-10 flex w-40 -translate-x-1/2 items-center gap-2 lg:left-10 lg:translate-x-0">
                    {ctaImagesRow1.map((image, index) => (
                      <span
                        key={image.src}
                        className="h-1 flex-1 origin-left animate-cta-bar rounded-full bg-white"
                        style={{
                          animationDelay: `-${(ctaImagesRow1.length - index) * 5}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </CustomStylesContext.Provider>
  );
}
