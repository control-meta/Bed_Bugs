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
} from "lucide-react";
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
    fontSizeCss = s.endsWith("px") || s.endsWith("rem") || s.endsWith("em") ? s : `${s}px`;
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

function cleanHtml(raw: any): string {
  if (typeof raw !== "string") return "";
  return raw
    .replace(/<font\s+color=["'](.*?)["']>(.*?)<\/font>/gi, '<span style="color: $1">$2</span>')
    .replace(/<font\s+size=["'](.*?)["']>(.*?)<\/font>/gi, '<span style="font-size: $1">$2</span>');
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
      <Component
        className={className}
        style={mergedStyle}
        {...(hasHtml ? { dangerouslySetInnerHTML: { __html: cleaned } } : {})}
      >
        {hasHtml ? undefined : (children ?? value)}
      </Component>
    );
  }

  // EDITING MODE: User clicks directly on text and types in-place with real-time rich-text support
  // No dangerouslySetInnerHTML or React children here so React reconciler never destroys active text selection
  return (
    <Component
      ref={elementRef}
      contentEditable={true}
      suppressContentEditableWarning={true}
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
      className={`transition-all duration-150 cursor-text outline-none ${className} ${
        itemIsActive
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
  "Guidance to reduce re-infestation risk",
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
    src: "/images/services/service-heat.jpg",
    alt: "Superheated dry steam bed bug treatment",
  },
];

const ctaImagesRow2 = [
  {
    src: "/images/treatment-3.png",
    alt: "Safe and effective bed bug treatment in progress",
  },
  {
    src: "/images/services/service-inspection.jpg",
    alt: "Professional bed bug harborage inspection",
  },
  {
    src: "/images/services/service-crevice.jpg",
    alt: "Deep crevice and mattress seam treatment",
  },
  {
    src: "/images/treatment-1.png",
    alt: "Restful sleep guaranteed bed bug free",
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
                    value={
                      customStyles?.heroHeading ||
                      location.heroHeading ||
                      `Bed Bug Treatment in <br/><span class="text-brand-600">${location.name}</span>`
                    }
                    as="h1"
                    className="font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl lg:text-[3rem]"
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
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full border border-white/40 bg-white/95 px-2.5 py-0.5 text-[10.5px] font-bold text-brand-800 shadow-sm backdrop-blur-md">
                      <Clock className="h-3 w-3 text-brand-600" />
                      <span>Dispatch: {location.responseTime}</span>
                    </div>
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full border border-white/40 bg-brand-700/90 px-2.5 py-0.5 text-[10.5px] font-semibold text-white shadow-sm backdrop-blur-md">
                      <ShieldCheck className="h-3 w-3 text-emerald-300" />
                      <span>Verified Branch</span>
                    </div>
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
                      Response:{" "}
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

                  {/* Top Badge: Response Time */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 rounded-full border border-white/40 bg-white/95 px-3 py-1 text-[11px] font-bold text-brand-800 shadow-md backdrop-blur-md">
                    <Clock className="h-3.5 w-3.5 text-brand-600" />
                    <span>Dispatch: {location.responseTime}</span>
                  </div>

                  {/* Top Left Badge: Verified Branch */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full border border-white/40 bg-brand-700/90 px-3 py-1 text-[11px] font-semibold text-white shadow-md backdrop-blur-md">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                    <span>Verified Branch</span>
                  </div>

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

        {/* 3. Localities & Neighborhoods Coverage */}
        <section className="bg-cream/50 pt-8 pb-4 lg:pt-10 lg:pb-5">
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
                as="p"
                className="text-xs font-medium text-ink/80 sm:text-sm"
              />
              <p className="mt-1 text-xs text-ink/70 sm:text-sm">
                Call{" "}
                <a
                  href={site.phoneHref}
                  className="font-semibold text-brand-700 underline hover:text-brand-800"
                >
                  {location.phoneDisplay}
                </a>{" "}
                to verify instant technician dispatch.
              </p>
            </div>
          </div>
        </section>

        {/* 4. 4-Step Elimination Process */}
        <section className="bg-cream/40 pt-4 pb-4 lg:pt-5 lg:pb-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <p className="flex items-center font-semibold uppercase gap-2.5 text-[11px] tracking-[0.22em] text-brand-600">
                <span className="h-px bg-current w-6" />
                <EditableItem
                  id="methodologyEyebrow"
                  label="Methodology Eyebrow"
                  value={customStyles?.methodologyEyebrow || "Our Proven Methodology"}
                  as="span"
                />
                <span className="h-px bg-current w-6" />
              </p>
              <EditableItem
                id="methodologyTitle"
                label="Methodology Section Title"
                value={
                  customStyles?.methodologyTitle ||
                  `How we eliminate bed bugs in ${location.name}`
                }
                as="h2"
                className="max-w-3xl font-display font-extrabold tracking-tight mt-3 text-2xl sm:text-3xl lg:text-4xl text-ink"
              />
              <EditableItem
                id="methodologyDesc"
                label="Methodology Description"
                value={
                  customStyles?.methodologyDesc ||
                  "Our scientific, dual-action extermination strategy kills adult bugs instantly and neutralizes eggs so they never hatch again."
                }
                as="p"
                className="max-w-2xl leading-relaxed mt-4 text-sm text-ink/65"
              />
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  stepKey: "step1",
                  num: "01",
                  defaultTitle: "Intensive Property Inspection",
                  defaultDesc:
                    "Thorough inspection of mattress seams, headboards, and crevices to detect all active bug harborages.",
                },
                {
                  stepKey: "step2",
                  num: "02",
                  defaultTitle: "Targeted Odorless Treatment",
                  defaultDesc:
                    "Government-approved odorless micro-emulsion injected into deep harborages to eliminate all active bugs.",
                },
                {
                  stepKey: "step3",
                  num: "03",
                  defaultTitle: "High-Heat Egg Eradication",
                  defaultDesc:
                    "Superheated dry steam penetrates fabric fibers and furniture joints to destroy hidden egg clusters.",
                },
                {
                  stepKey: "step4",
                  num: "04",
                  defaultTitle: "12-Month Warranty Protection",
                  defaultDesc:
                    "Official stamped 12-month certificate providing free re-treatments if any bed bug activity reappears.",
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="flex h-full flex-col justify-between rounded-2xl border border-ink/10 bg-white p-6 text-center shadow-sm transition duration-300 hover:border-brand-600/30 hover:shadow-md sm:text-left"
                >
                  <div>
                    <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-extrabold text-white sm:mx-0">
                      {step.num}
                    </span>
                    <EditableItem
                      id={`${step.stepKey}_title`}
                      label={`Step ${step.num} Title`}
                      value={customStyles?.[`${step.stepKey}_title`] || step.defaultTitle}
                      as="h3"
                      className="mt-4 flex min-h-[2.75rem] items-start justify-center font-display text-base font-bold text-ink sm:min-h-[3rem] sm:justify-start"
                    />
                    <EditableItem
                      id={`${step.stepKey}_desc`}
                      label={`Step ${step.num} Description`}
                      value={customStyles?.[`${step.stepKey}_desc`] || step.defaultDesc}
                      as="p"
                      className="mt-2 text-xs leading-relaxed text-ink/65"
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
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e3f6ed] text-[#008c5a]">
                          <Check className="h-3 w-3 stroke-[2.5]" />
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
                    className="mt-6 flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#008c5a] to-[#006c4a] px-4 py-3 text-center font-display text-sm font-bold text-white shadow-sm transition hover:brightness-110 active:scale-[0.99]"
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
              <article className="relative flex flex-col rounded-2xl border border-[#d9e9e2] bg-[#fdfffe] shadow-sm transition hover:shadow-md">
                <PopularBadge />

                <div className="flex items-center gap-4 rounded-t-2xl px-6 pb-4 pt-6 sm:px-7">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(ellipse_at_center,#c9eddd,#f0fcf6_70%)] text-[#008c5a]">
                    <CalendarCheck className="h-7 w-7" />
                  </span>
                  <div>
                    <EditableItem
                      id="plan2_title"
                      label="Plan 2 Title"
                      value={customStyles?.plan2_title || "1-Year Bed Bug AMC"}
                      as="h3"
                      className="font-display text-base font-bold text-[#146d51] sm:text-lg"
                    />
                    <EditableItem
                      id="plan2_sub"
                      label="Plan 2 Subtitle"
                      value={customStyles?.plan2_sub || "Long-term warranty coverage"}
                      as="p"
                      className="mt-0.5 text-xs text-[#2c916d] sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col px-6 pb-6 sm:px-7">
                  <ul className="flex-1 space-y-3">
                    {amcFeatures.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e3f6ed] text-[#008c5a]">
                          <Check className="h-3 w-3 stroke-[2.5]" />
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
                    className="mt-6 flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#008c5a] to-[#006c4a] px-4 py-3 text-center font-display text-sm font-bold text-white shadow-sm transition hover:brightness-110 active:scale-[0.99]"
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
          pageSlug={location.slug}
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
                      className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                        isOpen
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
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600/10 text-brand-600 transition-transform duration-300 ${
                            isOpen ? "rotate-45 bg-brand-600 text-white" : ""
                          }`}
                        >
                          <Plus className="h-4 w-4" />
                        </span>
                      </button>

                      <div
                        className={`grid transition-all duration-300 ease-out ${
                          isOpen
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
                <div className="px-7 pb-8 pt-10 max-sm:px-6 max-sm:pb-2 max-sm:pt-6 max-sm:text-center sm:px-10 lg:py-14">
                  <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand-300 max-sm:justify-center max-sm:text-[0.65rem] max-sm:tracking-[0.2em]">
                    <span className="h-px w-8 bg-brand-500" />
                    <EditableItem
                      id="ctaEyebrow"
                      label="CTA Eyebrow"
                      value={customStyles?.ctaEyebrow || "Book Your Bed Bug Treatment"}
                      as="span"
                    />
                  </p>
                  <EditableItem
                    id="ctaTitle"
                    label="CTA Title"
                    value={
                      customStyles?.ctaTitle || "Say goodbye to bed bugs permanently."
                    }
                    as="h2"
                    className="mt-4 font-display text-2xl font-extrabold leading-tight tracking-tight text-white max-sm:mt-3 max-sm:text-[1.4rem] sm:text-3xl lg:text-[2.25rem]"
                  />
                  <EditableItem
                    id="ctaDesc"
                    label="CTA Description"
                    value={
                      customStyles?.ctaDesc ||
                      `Schedule your Bed Bug Treatment today. Same-day service available across Pune, Mumbai, Bangalore, Delhi & Noida.`
                    }
                    as="p"
                    className="mt-4 max-w-lg text-sm leading-relaxed text-white/85 max-sm:mx-auto max-sm:mt-3 max-sm:text-[0.8rem]"
                  />

                  <div className="mt-6 flex items-center gap-2.5 sm:gap-3 flex-row flex-nowrap max-sm:justify-center">
                    {isEditing ? (
                      <div className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-500 px-5 text-xs font-semibold text-white shadow-lg shadow-brand-900/40 cursor-pointer shrink-0">
                        <CalendarCheck className="h-4 w-4 shrink-0" />
                        <EditableItem
                          id="ctaBtnBook"
                          label="CTA Book Button"
                          value={customStyles?.ctaBtnBook || "Book Bed Bug Treatment"}
                          as="span"
                        />
                      </div>
                    ) : (
                      <OpenFormButton
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-500 px-5 text-xs font-semibold text-white shadow-lg shadow-brand-900/40 transition hover:bg-brand-400 shrink-0"
                        ariaLabel="Book Bed Bug Treatment"
                      >
                        <CalendarCheck className="h-4 w-4 shrink-0" />
                        <span>
                          {customStyles?.ctaBtnBook || "Book Bed Bug Treatment"}
                        </span>
                      </OpenFormButton>
                    )}

                    <a
                      href={site.phoneHref}
                      className="inline-flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 hover:scale-105 active:scale-95 shrink-0"
                      title={`Call ${location.phoneDisplay || site.phoneDisplay}`}
                      aria-label={`Call ${location.phoneDisplay || site.phoneDisplay}`}
                    >
                      <Phone className="h-4 w-4 text-brand-300 shrink-0" />
                      {Boolean(customStyles?.ctaBtnCall) && (
                        <EditableItem
                          id="ctaBtnCall"
                          label="CTA Call Button"
                          value={customStyles?.ctaBtnCall}
                          as="span"
                        />
                      )}
                      {isEditing && !customStyles?.ctaBtnCall && (
                        <EditableItem
                          id="ctaBtnCall"
                          label="CTA Call Button"
                          value="Call"
                          as="span"
                          className="text-[11px] text-white/50"
                        />
                      )}
                    </a>
                  </div>
                </div>

                {/* Right Marquee Showcase */}
                <div className="group/marquee relative w-full overflow-hidden py-4 max-sm:py-3 sm:py-6 lg:py-8">
                  {/* Left & Right gradient fade masks */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 sm:w-16 bg-gradient-to-r from-[#0b2e1f] to-transparent" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 sm:w-16 bg-gradient-to-l from-[#0b2e1f] to-transparent" />

                  <div className="flex flex-col gap-3 max-sm:gap-2.5">
                    {/* Row 1 - Marquee Left */}
                    <div className="flex overflow-hidden">
                      <div className="flex shrink-0 items-center gap-3 pr-3 max-sm:gap-2 max-sm:pr-2 animate-cta-marquee will-change-transform group-hover/marquee:[animation-play-state:paused]">
                        {[...ctaImagesRow1, ...ctaImagesRow1].map((img, idx) => (
                          <div
                            key={`r1-${idx}`}
                            className="relative h-24 w-36 sm:h-32 sm:w-48 max-sm:h-20 max-sm:w-32 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl border border-white/15 shadow-md transition-transform duration-300 hover:scale-105 hover:border-brand-400/60"
                          >
                            <Image
                              src={img.src}
                              alt={altMap?.[img.src] || img.alt}
                              fill
                              sizes="(max-width: 640px) 130px, 200px"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Row 2 - Marquee Right */}
                    <div className="flex overflow-hidden">
                      <div className="flex shrink-0 items-center gap-3 pr-3 max-sm:gap-2 max-sm:pr-2 animate-cta-marquee-reverse will-change-transform group-hover/marquee:[animation-play-state:paused]">
                        {[...ctaImagesRow2, ...ctaImagesRow2].map((img, idx) => (
                          <div
                            key={`r2-${idx}`}
                            className="relative h-24 w-36 sm:h-32 sm:w-48 max-sm:h-20 max-sm:w-32 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl border border-white/15 shadow-md transition-transform duration-300 hover:scale-105 hover:border-brand-400/60"
                          >
                            <Image
                              src={img.src}
                              alt={altMap?.[img.src] || img.alt}
                              fill
                              sizes="(max-width: 640px) 130px, 200px"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
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
