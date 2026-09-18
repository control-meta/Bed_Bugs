"use client";

import { useEffect, useState, useRef } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  ChevronDown,
  Clock,
  Database,
  Edit3,
  ExternalLink,
  GripHorizontal,
  Italic,
  Loader2,
  MapPin,
  Minus,
  Palette,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Type,
  Underline,
  X,
} from "lucide-react";
import { LocationPageContent } from "@/components/location-page-content";
import type { ExtendedLocationInfo } from "@/lib/locations-db";

const COLOR_PRESETS = [
  { label: "Emerald", value: "#008c5a" },
  { label: "Forest Green", value: "#14532d" },
  { label: "Teal", value: "#0f766e" },
  { label: "Dark Slate / Ink", value: "#1e293b" },
  { label: "Muted Slate", value: "#64748b" },
  { label: "Royal Blue", value: "#1e40af" },
  { label: "Amber Gold", value: "#d97706" },
  { label: "Crimson Red", value: "#dc2626" },
  { label: "White", value: "#ffffff" },
];

interface ActiveEditorState {
  fieldId: string;
  label: string;
  value?: string;
  rect?: DOMRect;
  styleKey?: string;
}

export default function AdminEditPages() {
  const [locationsList, setLocationsList] = useState<{ slug: string; name: string; state: string }[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("pune");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [isSupabase, setIsSupabase] = useState<boolean | null>(null);

  // Canvas Zoom Scale percentage: 50% to 200% (default 100%)
  const [zoom, setZoom] = useState<number>(100);
  const [altMap, setAltMap] = useState<Record<string, string>>({});

  // Original location state (to detect dirty state)
  const [initialData, setInitialData] = useState<ExtendedLocationInfo | null>(null);
  // Current edited location state
  const [locationData, setLocationData] = useState<ExtendedLocationInfo | null>(null);

  // Floating Editor state
  const [activeEditor, setActiveEditor] = useState<ActiveEditorState | null>(null);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

  // Drag and drop state for Floating Editor card
  const [toolbarPos, setToolbarPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const hasUserDraggedRef = useRef(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialLeft: number; initialTop: number } | null>(null);

  const floatingToolbarRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const savedSelectionRangeRef = useRef<Range | null>(null);

  // Keep saved selection updated whenever user selects text inside an editable item
  useEffect(() => {
    const handleSelectionChange = () => {
      if (typeof window === "undefined") return;
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && sel.toString().length > 0) {
        const range = sel.getRangeAt(0);
        let node: Node | null = range.commonAncestorContainer;
        let isInsideEditable = false;
        while (node) {
          if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).isContentEditable) {
            isInsideEditable = true;
            break;
          }
          node = node.parentNode;
        }
        if (isInsideEditable) {
          savedSelectionRangeRef.current = range.cloneRange();
        }
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  // 1. Fetch available location pages
  const fetchLocationsList = async () => {
    try {
      const res = await fetch("/api/admin/locations");
      if (res.ok) {
        const json = await res.json();
        if (json.locations && json.locations.length > 0) {
          setLocationsList(json.locations);
        }
      }
    } catch (err) {
      console.error("Failed to load locations list:", err);
    }
  };

  // 2. Fetch specific location data by slug
  const fetchLocationData = async (slug: string) => {
    setLoading(true);
    setSaveSuccessMessage(null);
    setSaveErrorMessage(null);
    setActiveEditor(null);

    try {
      const res = await fetch(`/api/admin/locations/${slug}`);
      if (res.ok) {
        const json = await res.json();
        if (json.location) {
          setInitialData(JSON.parse(JSON.stringify(json.location)));
          setLocationData(json.location);
          if (typeof json.isSupabase === "boolean") {
            setIsSupabase(json.isSupabase);
          }
        }
      } else {
        setSaveErrorMessage(`Could not load page data for '${slug}'`);
      }
    } catch (err: any) {
      setSaveErrorMessage(err.message || "Failed to load location data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationsList();
    fetch("/api/admin/seo")
      .then((res) => res.json())
      .then((json) => {
        if (json.images && Array.isArray(json.images)) {
          const map: Record<string, string> = {};
          for (const img of json.images) {
            if (img.src && img.altText) map[img.src] = img.altText;
          }
          setAltMap(map);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedSlug) {
      fetchLocationData(selectedSlug);
    }
  }, [selectedSlug]);

  // Detect unsaved changes
  const isDirty =
    initialData && locationData
      ? JSON.stringify(initialData) !== JSON.stringify(locationData)
      : false;

  // Publish changes to database and revalidate live route
  const handlePublish = async () => {
    if (!locationData) return;
    setSaving(true);
    setSaveSuccessMessage(null);
    setSaveErrorMessage(null);

    try {
      const res = await fetch(`/api/admin/locations/${selectedSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(locationData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to publish changes.");
      }

      setInitialData(JSON.parse(JSON.stringify(json.location)));
      setLocationData(json.location);
      setSaveSuccessMessage(`Published successfully! ${json.location.name} is now live.`);

      setTimeout(() => {
        setSaveSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      setSaveErrorMessage(err.message || "Failed to publish page.");
    } finally {
      setSaving(false);
    }
  };

  // Discard changes
  const handleDiscard = () => {
    if (initialData && confirm("Are you sure you want to discard all unpublished edits?")) {
      setLocationData(JSON.parse(JSON.stringify(initialData)));
      setActiveEditor(null);
    }
  };

  // Handle focusing any text element directly on the page
  const handleFocusField = (id: string, label: string, rect: DOMRect) => {
    setActiveEditor({
      fieldId: id,
      label: label,
      rect: rect,
    });
    setShowColorPicker(false);

    // Position toolbar near element if user hasn't explicitly dragged it yet
    if (!hasUserDraggedRef.current || !toolbarPos) {
      if (rect && typeof window !== "undefined") {
        const toolbarHeight = 44;
        let top = rect.top - toolbarHeight - 12;
        if (top < 75) {
          top = rect.bottom + 12;
        }
        top = Math.max(75, Math.min(window.innerHeight - toolbarHeight - 16, top));

        let left = rect.left + rect.width / 2 - 200;
        left = Math.max(16, Math.min(window.innerWidth - 420, left));

        setToolbarPos({ x: left, y: top });
      } else {
        setToolbarPos({ x: 24, y: 90 });
      }
    }
  };

  // Direct text update from contentEditable element on the page
  const handleTextChange = (fieldId: string, newVal: string) => {
    if (!locationData) return;

    setLocationData((prev) => {
      if (!prev) return null;
      const next = { ...prev };

      if (fieldId === "heroHeading") {
        next.heroHeading = newVal;
      } else if (fieldId === "tagline") {
        next.tagline = newVal;
      } else if (fieldId === "heroDescription") {
        next.heroDescription = newVal;
      } else if (fieldId === "responseTime") {
        next.responseTime = newVal;
      } else if (fieldId === "homesTreated") {
        next.homesTreated = newVal;
      } else if (fieldId === "rating") {
        next.rating = newVal;
      } else if (fieldId === "reviewCount") {
        next.reviewCount = newVal;
      } else if (fieldId === "phoneDisplay") {
        next.phoneDisplay = newVal;
      } else if (fieldId === "cityBadge") {
        next.customStyles = {
          ...(next.customStyles || {}),
          cityBadge: newVal,
        };
      } else if (fieldId === "verifiedBranchBadge") {
        next.customStyles = {
          ...(next.customStyles || {}),
          verifiedBranchBadge: newVal,
        };
      } else if (fieldId === "btnCallText") {
        next.customStyles = {
          ...(next.customStyles || {}),
          btnCallText: newVal,
        };
      } else if (fieldId === "btnWhatsappText") {
        next.customStyles = {
          ...(next.customStyles || {}),
          btnWhatsappText: newVal,
        };
      } else if (fieldId === "btnBookText") {
        next.customStyles = {
          ...(next.customStyles || {}),
          btnBookText: newVal,
        };
      } else if (fieldId === "ctaBtnCall") {
        next.customStyles = {
          ...(next.customStyles || {}),
          ctaBtnCall: newVal,
        };
      } else if (fieldId === "ctaBtnBook") {
        next.customStyles = {
          ...(next.customStyles || {}),
          ctaBtnBook: newVal,
        };
      } else if (fieldId.startsWith("highlight-")) {
        const parts = fieldId.split("-");
        const idx = parseInt(parts[1], 10);
        const sub = parts[2];
        if (sub === "guarantee") {
          next.customStyles = {
            ...(next.customStyles || {}),
            [fieldId]: newVal,
          };
        } else {
          const list = [...(next.localHighlights || [])];
          if (list[idx]) {
            list[idx] = {
              ...list[idx],
              [sub === "title" ? "title" : "description"]: newVal,
            };
            next.localHighlights = list;
          }
        }
      } else if (fieldId.startsWith("zone-")) {
        const parts = fieldId.split("-");
        const idx = parseInt(parts[1], 10);
        const sub = parts[2];
        const list = [...(next.coverageAreas || [])];
        if (list[idx]) {
          if (sub === "title") {
            list[idx] = { ...list[idx], zone: newVal };
          } else if (sub === "loc") {
            const locIdx = parseInt(parts[3], 10);
            const locs = [...list[idx].localities];
            locs[locIdx] = newVal;
            list[idx] = { ...list[idx], localities: locs };
          } else if (sub === "localities") {
            list[idx] = {
              ...list[idx],
              localities: newVal.split(",").map((s) => s.trim()).filter(Boolean),
            };
          }
          next.coverageAreas = list;
        }
      } else if (fieldId.startsWith("faq-")) {
        const parts = fieldId.split("-");
        const idx = parseInt(parts[1], 10);
        const sub = parts[2];
        const list = [...(next.faqs || [])];
        if (list[idx]) {
          list[idx] = {
            ...list[idx],
            [sub === "q" ? "question" : "answer"]: newVal,
          };
          next.faqs = list;
        }
      } else if (fieldId.startsWith("review_") || fieldId.startsWith("review-")) {
        const separator = fieldId.includes("_") ? "_" : "-";
        const parts = fieldId.split(separator);
        const idx = parseInt(parts[1], 10);
        const sub = parts[2];
        const list = [...(next.reviews || [])];
        if (list[idx]) {
          list[idx] = {
            ...list[idx],
            [sub === "quote" ? "quote" : sub === "author" ? "name" : "locality"]: newVal,
          };
          next.reviews = list;
        }
      } else {
        next.customStyles = {
          ...(next.customStyles || {}),
          [fieldId]: newVal,
        };
      }

      return next;
    });
  };

  // Update style property live
  const handleStyleChange = (prop: string, val: string) => {
    setLocationData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        customStyles: {
          ...(prev.customStyles || {}),
          [prop]: val,
        },
      };
    });
  };

  // Direct font size change
  const handleFontSizeChange = (sizeInPx: number) => {
    if (!activeEditor || !locationData) return;
    const { fieldId } = activeEditor;
    const pxStr = `${sizeInPx}px`;

    setLocationData((prev) => {
      if (!prev) return null;
      const nextStyles = { ...(prev.customStyles || {}) };
      nextStyles[`${fieldId}_size`] = pxStr;
      if (fieldId === "heroHeading") {
        nextStyles.heroTitleSize = pxStr;
        nextStyles.heroHeading_size = pxStr;
      }
      if (fieldId === "heroDescription") {
        nextStyles.heroDesc_size = pxStr;
        nextStyles.heroDescription_size = pxStr;
      }
      if (fieldId === "tagline") {
        nextStyles.tagline_size = pxStr;
      }
      return {
        ...prev,
        customStyles: nextStyles,
      };
    });
  };

  // Drag & Drop handlers for mouse & touch
  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();

    const currentLeft = toolbarPos?.x ?? 24;
    const currentTop = toolbarPos?.y ?? 90;

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialLeft: currentLeft,
      initialTop: currentTop,
    };
    hasUserDraggedRef.current = true;
    setIsDragging(true);
  };

  const handleTouchDragStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];

    const currentLeft = toolbarPos?.x ?? 24;
    const currentTop = toolbarPos?.y ?? 90;

    dragStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      initialLeft: currentLeft,
      initialTop: currentTop,
    };
    hasUserDraggedRef.current = true;
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;

      const toolbarWidth = floatingToolbarRef.current?.offsetWidth || 400;
      const toolbarHeight = floatingToolbarRef.current?.offsetHeight || 60;

      const maxLeft = Math.max(10, window.innerWidth - toolbarWidth - 10);
      const maxTop = Math.max(65, window.innerHeight - toolbarHeight - 10);

      const newLeft = Math.max(10, Math.min(maxLeft, dragStartRef.current.initialLeft + dx));
      const newTop = Math.max(65, Math.min(maxTop, dragStartRef.current.initialTop + dy));

      setToolbarPos({ x: newLeft, y: newTop });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragStartRef.current || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const dx = touch.clientX - dragStartRef.current.startX;
      const dy = touch.clientY - dragStartRef.current.startY;

      const toolbarWidth = floatingToolbarRef.current?.offsetWidth || 400;
      const toolbarHeight = floatingToolbarRef.current?.offsetHeight || 60;

      const maxLeft = Math.max(10, window.innerWidth - toolbarWidth - 10);
      const maxTop = Math.max(65, window.innerHeight - toolbarHeight - 10);

      const newLeft = Math.max(10, Math.min(maxLeft, dragStartRef.current.initialLeft + dx));
      const newTop = Math.max(65, Math.min(maxTop, dragStartRef.current.initialTop + dy));

      setToolbarPos({ x: newLeft, y: newTop });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isDragging]);

  // Helper to extract active item's current font size in px
  // Get current font size (for selection if selected, or for the active item)
  const getCurrentItemFontSize = (): number => {
    if (!activeEditor) return 16;
    const { fieldId } = activeEditor;

    // 1. If text is currently selected, get its computed font size
    if (typeof window !== "undefined") {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && sel.toString().length > 0) {
        const anchor = sel.anchorNode;
        const el = anchor?.nodeType === Node.ELEMENT_NODE ? (anchor as HTMLElement) : anchor?.parentElement;
        if (el) {
          const comp = window.getComputedStyle(el).fontSize;
          const num = parseInt(comp, 10);
          if (!isNaN(num) && num > 0) return num;
        }
      }
    }

    // 2. Otherwise get custom styles font size
    const raw =
      locationData?.customStyles?.[`${fieldId}_size`] ||
      (fieldId === "heroHeading"
        ? locationData?.customStyles?.heroTitleSize || locationData?.customStyles?.heroHeading_size
        : undefined) ||
      (fieldId === "tagline" ? locationData?.customStyles?.tagline_size : undefined) ||
      (fieldId === "heroDescription"
        ? locationData?.customStyles?.heroDesc_size || locationData?.customStyles?.heroDescription_size
        : undefined);

    if (!raw) {
      if (fieldId === "heroHeading") return 48;
      if (fieldId === "tagline") return 18;
      if (fieldId.includes("Title") || fieldId.includes("title") || fieldId.includes("heading")) return 28;
      if (fieldId === "heroDescription" || fieldId.includes("desc") || fieldId.includes("Desc")) return 16;
      if (fieldId === "cityBadge" || fieldId === "verifiedBranchBadge") return 12;
      return 14;
    }

    const str = String(raw).trim();
    if (!isNaN(Number(str))) return Number(str);
    if (str.endsWith("px")) {
      const n = parseInt(str, 10);
      return isNaN(n) ? 16 : n;
    }
    if (str.endsWith("rem")) {
      const n = parseFloat(str);
      return isNaN(n) ? 16 : Math.round(n * 16);
    }
    const bracketRem = str.match(/\[([\d.]+)rem\]/);
    if (bracketRem) return Math.round(parseFloat(bracketRem[1]) * 16);
    const bracketPx = str.match(/\[(\d+)px\]/);
    if (bracketPx) return parseInt(bracketPx[1], 10);

    if (str.includes("6xl")) return 60;
    if (str.includes("5xl")) return 48;
    if (str.includes("4xl")) return 36;
    if (str.includes("3xl")) return 30;
    if (str.includes("2xl")) return 24;
    if (str.includes("xl")) return 20;
    if (str.includes("lg")) return 18;
    if (str.includes("base")) return 16;
    if (str.includes("sm")) return 14;
    if (str.includes("xs")) return 12;

    const match = str.match(/\d+/);
    if (match) {
      const parsed = parseInt(match[0], 10);
      return parsed > 8 ? parsed : 16;
    }
    return 16;
  };

  // Synchronize HTML from editable element to locationData state
  const syncActiveElementHTML = (fieldId: string) => {
    let el: HTMLElement | null = null;
    if (typeof document !== "undefined") {
      const activeEl = document.activeElement as HTMLElement | null;
      if (activeEl && activeEl.isContentEditable) {
        el = activeEl;
      } else {
        el = (document.querySelector(`.ring-emerald-500\\/20`) as HTMLElement | null) ||
             (document.querySelector(`[title*="${fieldId}"]`) as HTMLElement | null);
      }
    }
    if (el) {
      handleTextChange(fieldId, el.innerHTML);
    }
  };

  // Helper to get active or restore saved selection
  const getActiveSelection = (): { sel: Selection; range: Range } | null => {
    if (typeof window === "undefined") return null;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && sel.toString().length > 0) {
      return { sel, range: sel.getRangeAt(0) };
    }
    if (savedSelectionRangeRef.current && savedSelectionRangeRef.current.toString().length > 0) {
      try {
        const selObj = window.getSelection();
        if (selObj) {
          selObj.removeAllRanges();
          selObj.addRange(savedSelectionRangeRef.current);
          return { sel: selObj, range: savedSelectionRangeRef.current };
        }
      } catch {
        // ignore
      }
    }
    return null;
  };

  // Apply inline style (color or fontSize) to selected text ONLY
  const applyInlineStyleToSelection = (styleProp: "color" | "fontSize", styleValue: string): boolean => {
    const activeSel = getActiveSelection();
    if (!activeSel || !activeEditor) return false;

    const { sel, range } = activeSel;
    const selectedText = sel.toString();
    if (!selectedText || selectedText.trim().length === 0) return false;

    // Check if range is already inside a span with this exact text
    let commonParent: Node | null = range.commonAncestorContainer;
    if (commonParent.nodeType === Node.TEXT_NODE) {
      commonParent = commonParent.parentNode;
    }

    if (
      commonParent &&
      commonParent.nodeType === Node.ELEMENT_NODE &&
      (commonParent as HTMLElement).tagName === "SPAN" &&
      (commonParent as HTMLElement).textContent === selectedText
    ) {
      const spanEl = commonParent as HTMLElement;
      if (styleProp === "color") {
        spanEl.style.color = styleValue;
      } else if (styleProp === "fontSize") {
        spanEl.style.fontSize = styleValue;
      }

      // Keep spanEl selected so user can continue editing/clicking
      const reselectExisting = () => {
        try {
          const s = window.getSelection();
          if (s) {
            s.removeAllRanges();
            const r = document.createRange();
            r.selectNodeContents(spanEl);
            s.addRange(r);
            savedSelectionRangeRef.current = r.cloneRange();
          }
        } catch {
          // ignore
        }
      };
      reselectExisting();
      requestAnimationFrame(reselectExisting);

      syncActiveElementHTML(activeEditor.fieldId);
      return true;
    }

    try {
      const span = document.createElement("span");
      if (styleProp === "color") {
        span.style.color = styleValue;
      } else if (styleProp === "fontSize") {
        span.style.fontSize = styleValue;
      }

      const extracted = range.extractContents();
      span.appendChild(extracted);
      range.insertNode(span);

      // Re-select newly styled node and keep it selected across rendering frames
      const reselectNew = () => {
        try {
          const s = window.getSelection();
          if (s) {
            s.removeAllRanges();
            const newRange = document.createRange();
            newRange.selectNodeContents(span);
            s.addRange(newRange);
            savedSelectionRangeRef.current = newRange.cloneRange();
          }
        } catch {
          // ignore
        }
      };
      reselectNew();
      requestAnimationFrame(reselectNew);

      syncActiveElementHTML(activeEditor.fieldId);
      return true;
    } catch (err) {
      console.error("Failed to apply inline style:", err);
      return false;
    }
  };

  const handleFontSizeStep = (delta: number) => {
    if (!activeEditor) return;
    const current = getCurrentItemFontSize();
    const nextSize = Math.max(10, Math.min(120, current + delta));

    // If text is selected, apply font size to selection ONLY!
    const applied = applyInlineStyleToSelection("fontSize", `${nextSize}px`);
    if (!applied) {
      // If no text is selected, apply to whole item
      handleFontSizeChange(nextSize);
    }
  };

  const toggleBold = () => {
    if (!activeEditor || !locationData) return;
    const activeSel = getActiveSelection();
    if (activeSel) {
      document.execCommand("styleWithCSS", false, "true");
      document.execCommand("bold");
      syncActiveElementHTML(activeEditor.fieldId);
      return;
    }
    const currentWeight = locationData.customStyles?.[`${activeEditor.fieldId}_weight`];
    const isBold = currentWeight === "bold" || currentWeight === "700" || currentWeight === "800" || currentWeight === "900";
    handleStyleChange(`${activeEditor.fieldId}_weight`, isBold ? "normal" : "bold");
  };

  const toggleItalic = () => {
    if (!activeEditor || !locationData) return;
    const activeSel = getActiveSelection();
    if (activeSel) {
      document.execCommand("styleWithCSS", false, "true");
      document.execCommand("italic");
      syncActiveElementHTML(activeEditor.fieldId);
      return;
    }
    const isItalic = Boolean(locationData.customStyles?.[`${activeEditor.fieldId}_italic`]);
    handleStyleChange(`${activeEditor.fieldId}_italic`, isItalic ? "" : "true");
  };

  const toggleUnderline = () => {
    if (!activeEditor || !locationData) return;
    const activeSel = getActiveSelection();
    if (activeSel) {
      document.execCommand("styleWithCSS", false, "true");
      document.execCommand("underline");
      syncActiveElementHTML(activeEditor.fieldId);
      return;
    }
    const isUnderline = Boolean(locationData.customStyles?.[`${activeEditor.fieldId}_underline`]);
    handleStyleChange(`${activeEditor.fieldId}_underline`, isUnderline ? "" : "true");
  };

  const setAlignment = (align: "left" | "center" | "right") => {
    if (!activeEditor || !locationData) return;
    handleStyleChange(`${activeEditor.fieldId}_align`, align);
  };

  const handleColorSelect = (color: string) => {
    if (!activeEditor || !locationData) return;

    // If text is selected, apply color to selection ONLY!
    const applied = applyInlineStyleToSelection("color", color);
    if (applied) {
      return;
    }

    // Otherwise apply to whole item
    const nextStyles = { ...(locationData.customStyles || {}) };
    nextStyles[`${activeEditor.fieldId}_color`] = color;
    if (activeEditor.fieldId === "heroHeading") {
      nextStyles.heroTitleColor = color;
    }
    if (activeEditor.fieldId === "tagline") {
      nextStyles.tagline_color = color;
    }
    if (activeEditor.fieldId === "heroDescription") {
      nextStyles.heroDesc_color = color;
    }
    setLocationData((prev) => (prev ? { ...prev, customStyles: nextStyles } : null));
  };

  const currentItemTextColor = activeEditor
    ? locationData?.customStyles?.[`${activeEditor.fieldId}_color`] ||
      (activeEditor.fieldId === "heroHeading"
        ? locationData?.customStyles?.heroTitleColor
        : "") ||
      (activeEditor.fieldId === "tagline"
        ? locationData?.customStyles?.tagline_color
        : "") ||
      (activeEditor.fieldId === "heroDescription"
        ? locationData?.customStyles?.heroDesc_color
        : "") ||
      ""
    : "";

  const currentWeight = activeEditor
    ? locationData?.customStyles?.[`${activeEditor.fieldId}_weight`] || ""
    : "";
  const isCurrentBold =
    currentWeight === "bold" ||
    currentWeight === "700" ||
    currentWeight === "800" ||
    currentWeight === "900";

  const isCurrentItalic = activeEditor
    ? Boolean(locationData?.customStyles?.[`${activeEditor.fieldId}_italic`])
    : false;

  const isCurrentUnderline = activeEditor
    ? Boolean(locationData?.customStyles?.[`${activeEditor.fieldId}_underline`])
    : false;

  const currentAlignment = activeEditor
    ? (locationData?.customStyles?.[`${activeEditor.fieldId}_align`] as "left" | "center" | "right" | undefined) || "left"
    : "left";

  const currentItemBgColor = activeEditor
    ? locationData?.customStyles?.[`${activeEditor.fieldId}_bg`] || ""
    : "";

  const currentFontSize = getCurrentItemFontSize();

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-neutral-100 font-sans text-neutral-900 min-h-0">
      {/* 1. Sleek Sticky Header Studio Bar */}
      <header className="z-40 flex flex-wrap items-center justify-between gap-2.5 border-b border-neutral-200 bg-white px-3.5 py-2 shadow-xs shrink-0">
        {/* Left: Location Selector Dropdown & DB Info */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="appearance-none rounded-xl border border-neutral-300 bg-white py-1.5 pl-3 pr-8 text-xs font-bold text-neutral-900 shadow-xs hover:border-emerald-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {locationsList.map((loc) => (
                <option key={loc.slug} value={loc.slug}>
                  📍 {loc.name}, {loc.state} (/{loc.slug})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
          </div>

          {/* Database indicator */}
          {isSupabase !== null && (
            <span
              className={`hidden 2xl:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                isSupabase
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}
            >
              <Database className="h-3 w-3" />
              <span>{isSupabase ? "Supabase" : "Local"}</span>
            </span>
          )}

          {/* View Live Page Link */}
          <a
            href={`/${selectedSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100 hover:text-emerald-700 transition"
            title="Open live page in new browser tab"
          >
            <span>Live Page</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Center: Zoom Scaling Controls (+ and - buttons) */}
        <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200/90 shadow-2xs">
          <button
            type="button"
            onClick={() => setZoom((prev) => Math.max(50, prev - 10))}
            disabled={zoom <= 50}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-700 hover:bg-white hover:text-neutral-900 hover:shadow-xs disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
            title="Zoom Out (-10%)"
            aria-label="Zoom Out"
          >
            <Minus className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setZoom(100)}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
              zoom === 100
                ? "text-neutral-700 hover:bg-white/80"
                : "bg-white text-emerald-700 shadow-xs ring-1 ring-black/5"
            }`}
            title="Click to reset zoom to 100%"
          >
            {zoom}%
          </button>

          <button
            type="button"
            onClick={() => setZoom((prev) => Math.min(200, prev + 10))}
            disabled={zoom >= 200}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-700 hover:bg-white hover:text-neutral-900 hover:shadow-xs disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
            title="Zoom In (+10%)"
            aria-label="Zoom In"
          >
            <Plus className="h-4 w-4" />
          </button>

          {zoom !== 100 && (
            <button
              type="button"
              onClick={() => setZoom(100)}
              className="ml-0.5 flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-white hover:text-neutral-700 hover:shadow-xs transition cursor-pointer"
              title="Reset to 100%"
              aria-label="Reset zoom to 100%"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Right Actions: Discard & Save/Publish */}
        <div className="flex items-center gap-2">
          {isDirty && (
            <span className="hidden xl:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
              Unsaved
            </span>
          )}

          <button
            onClick={handleDiscard}
            disabled={!isDirty || saving}
            className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 disabled:opacity-40 transition"
            title="Discard all changes"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Discard</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={saving || !isDirty}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Publish Changes</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Notice alerts (Success or Error) */}
      {saveSuccessMessage && (
        <div className="z-30 flex items-center justify-between gap-2 bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>{saveSuccessMessage}</span>
          </div>
          <button onClick={() => setSaveSuccessMessage(null)}>
            <X className="h-3.5 w-3.5 text-white/80 hover:text-white" />
          </button>
        </div>
      )}

      {saveErrorMessage && (
        <div className="z-30 flex items-center justify-between gap-2 bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md">
          <span>{saveErrorMessage}</span>
          <button onClick={() => setSaveErrorMessage(null)}>
            <X className="h-3.5 w-3.5 text-white/80 hover:text-white" />
          </button>
        </div>
      )}

      {/* 2. Full Live Page Preview Canvas with Smooth Native Scroll & Zoom Scaling */}
      <main
        ref={scrollContainerRef}
        className="relative flex-1 min-h-0 overflow-y-auto overflow-x-auto overscroll-contain bg-white flex flex-col"
      >
        {loading ? (
          <div className="flex h-96 w-full flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-sm font-semibold text-neutral-600">
              Loading preview for {selectedSlug}...
            </p>
          </div>
        ) : locationData ? (
          <div
            className="w-full min-h-full bg-white transition-all duration-150 origin-top"
            style={{
              zoom: zoom !== 100 ? `${zoom}%` : undefined,
            }}
          >
            <LocationPageContent
              location={locationData}
              customStyles={locationData.customStyles}
              isEditing={true}
              activeFieldId={activeEditor?.fieldId || null}
              onFocusField={handleFocusField}
              onUpdateText={handleTextChange}
              altMap={altMap}
            />
          </div>
        ) : (
          <div className="flex h-96 w-full flex-col items-center justify-center gap-2 text-neutral-500">
            <p>Could not load location preview.</p>
          </div>
        )}
      </main>

      {/* 3. Compact Floating Format Toolbar (Font Size, Colour, Bold, Italic, Underline, Alignments) */}
      {activeEditor && locationData && (
        <div
          ref={floatingToolbarRef}
          style={{
            position: "fixed",
            top: `${toolbarPos?.y ?? 90}px`,
            left: `${toolbarPos?.x ?? 24}px`,
            zIndex: 60,
            userSelect: isDragging ? "none" : "auto",
          }}
          onMouseDown={(e) => {
            if ((e.target as HTMLElement).tagName !== "INPUT") {
              e.preventDefault();
            }
          }}
          className={`rounded-2xl border border-neutral-300/90 bg-white/98 shadow-2xl ring-1 ring-black/10 backdrop-blur-xl transition-shadow duration-150 flex items-center p-1.5 gap-1 max-w-[96vw] ${
            isDragging ? "ring-2 ring-emerald-500 shadow-emerald-500/20 cursor-grabbing" : ""
          }`}
        >
          {/* Drag Handle & Label */}
          <div
            onMouseDown={handleDragStart}
            onTouchStart={handleTouchDragStart}
            className="flex items-center gap-1.5 px-2 py-1 bg-neutral-100 rounded-lg cursor-grab active:cursor-grabbing select-none hover:bg-neutral-200/80 transition"
            title="Click and drag to reposition the toolbar"
          >
            <GripHorizontal className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
            <span className="text-[11px] font-bold text-neutral-700 max-w-[90px] sm:max-w-[130px] truncate">
              {activeEditor.label}
            </span>
          </div>

          <div className="h-5 w-px bg-neutral-200 shrink-0 mx-0.5" />

          {/* Font Size: [-] 16px [+] */}
          <div className="flex items-center bg-neutral-50 rounded-lg border border-neutral-200/80 p-0.5">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleFontSizeStep(-1);
              }}
              className="h-6 w-6 flex items-center justify-center rounded text-neutral-600 hover:bg-white hover:text-neutral-900 hover:shadow-xs transition active:scale-95"
              title="Decrease font size (-1px)"
            >
              <Minus className="h-3 w-3" />
            </button>

            <span
              className="px-1.5 text-xs font-bold text-neutral-800 min-w-[34px] text-center select-none"
              title="Current font size"
            >
              {currentFontSize}px
            </span>

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleFontSizeStep(1);
              }}
              className="h-6 w-6 flex items-center justify-center rounded text-neutral-600 hover:bg-white hover:text-neutral-900 hover:shadow-xs transition active:scale-95"
              title="Increase font size (+1px)"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="h-5 w-px bg-neutral-200 shrink-0 mx-0.5" />

          {/* Bold, Italic, Underline */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                toggleBold();
              }}
              className={`h-7 w-7 flex items-center justify-center rounded-lg transition active:scale-95 ${
                isCurrentBold
                  ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-500/30"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
              title="Toggle Bold (B)"
            >
              <Bold className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                toggleItalic();
              }}
              className={`h-7 w-7 flex items-center justify-center rounded-lg transition active:scale-95 ${
                isCurrentItalic
                  ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-500/30"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
              title="Toggle Italic (I)"
            >
              <Italic className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                toggleUnderline();
              }}
              className={`h-7 w-7 flex items-center justify-center rounded-lg transition active:scale-95 ${
                isCurrentUnderline
                  ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-500/30"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
              title="Toggle Underline (U)"
            >
              <Underline className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="h-5 w-px bg-neutral-200 shrink-0 mx-0.5" />

          {/* Alignments: Left, Center, Right */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setAlignment("left");
              }}
              className={`h-7 w-7 flex items-center justify-center rounded-lg transition active:scale-95 ${
                currentAlignment === "left" || !currentAlignment
                  ? "bg-neutral-200/80 text-neutral-900"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
              title="Align Left"
            >
              <AlignLeft className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setAlignment("center");
              }}
              className={`h-7 w-7 flex items-center justify-center rounded-lg transition active:scale-95 ${
                currentAlignment === "center"
                  ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-500/30"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
              title="Align Center"
            >
              <AlignCenter className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setAlignment("right");
              }}
              className={`h-7 w-7 flex items-center justify-center rounded-lg transition active:scale-95 ${
                currentAlignment === "right"
                  ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-500/30"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
              title="Align Right"
            >
              <AlignRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="h-5 w-px bg-neutral-200 shrink-0 mx-0.5" />

          {/* Text Colour Palette Button + Popover */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setShowColorPicker((prev) => !prev);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition active:scale-95 ${
                showColorPicker ? "bg-neutral-100 ring-1 ring-neutral-300" : "hover:bg-neutral-100"
              }`}
              title="Text Color"
            >
              <span
                className="h-3.5 w-3.5 rounded-full border border-black/20 shadow-xs shrink-0"
                style={{ backgroundColor: currentItemTextColor || "#1e293b" }}
              />
              <Palette className="h-3.5 w-3.5 text-neutral-600 shrink-0" />
            </button>

            {/* Color Swatches Popover */}
            {showColorPicker && (
              <div
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute left-0 top-full mt-2 w-52 rounded-xl border border-neutral-200 bg-white p-2.5 shadow-2xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    Text Colors
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(false)}
                    className="text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1.5 mb-2.5">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleColorSelect(c.value);
                      }}
                      className="h-6 w-full rounded-md border border-neutral-200 shadow-2xs hover:scale-105 active:scale-95 transition flex items-center justify-center"
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    >
                      {currentItemTextColor === c.value && (
                        <Check
                          className={`h-3 w-3 ${c.value === "#ffffff" ? "text-neutral-900" : "text-white"}`}
                        />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  <span className="text-[11px] font-medium text-neutral-600">Custom:</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={currentItemTextColor || "#1e293b"}
                      onChange={(e) => handleColorSelect(e.target.value)}
                      className="h-6 w-8 cursor-pointer rounded border border-neutral-300 bg-transparent p-0"
                    />
                    {currentItemTextColor && (
                      <button
                        type="button"
                        onClick={() => handleColorSelect("")}
                        className="text-[10px] text-neutral-400 hover:text-neutral-700 underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-neutral-200 shrink-0 mx-0.5" />

          {/* Close / Dismiss */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setActiveEditor(null);
              setShowColorPicker(false);
            }}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
            title="Close Toolbar"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
