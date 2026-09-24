"use client";

import { useEffect, useState } from "react";
import {
  Download,
  Loader2,
  MapPin,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  Edit2,
  X,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";

type CustomerReview = {
  id: string;
  name: string;
  city?: string | null;
  service?: string | null;
  rating: number;
  quote: string;
  created_at: string;
  status: "pending" | "approved" | "denied";
  page_slug?: string | null;
};

type PageItem = {
  path: string;
  title: string;
};

const CITY_PAGE_PATHS = [
  "/bangalore",
  "/mumbai",
  "/pune",
];

const EXCLUDED_REVIEW_PAGE_PATHS = ["/about", "/contact", "/blog", "/faq"];

const MAX_GENERATE_COUNT = 50;

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    service: "",
    rating: "5",
    quote: "",
    status: "pending",
    page_slug: "",
  });

  // AI Review Generator State
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genPageSlug, setGenPageSlug] = useState("/");
  const [genCountInput, setGenCountInput] = useState("5");
  const [genRatingType, setGenRatingType] = useState("mostly_5");
  const [genStatus, setGenStatus] = useState<"approved" | "pending">("approved");
  const [generatedReviews, setGeneratedReviews] = useState<CustomerReview[] | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [genProgress, setGenProgress] = useState<{ current: number; total: number; page: string } | null>(null);

  const genCount = Math.min(
    MAX_GENERATE_COUNT,
    Math.max(1, parseInt(genCountInput, 10) || 1),
  );

  const getTargetPages = () => {
    const dynamic = pages
      .map((p) => p.path)
      .filter(
        (path) =>
          path !== "/" &&
          !CITY_PAGE_PATHS.includes(path) &&
          !EXCLUDED_REVIEW_PAGE_PATHS.includes(path),
      );
    return Array.from(new Set(["/", ...CITY_PAGE_PATHS, ...dynamic]));
  };

  const generateForPage = async (pageSlug: string): Promise<CustomerReview[]> => {
    const res = await fetch("/api/admin/reviews/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_slug: pageSlug,
        count: genCount,
        rating_type: genRatingType,
        status: genStatus,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to generate reviews");
    return (data.reviews || []) as CustomerReview[];
  };

  const handleGenerateReviews = async () => {
    setIsGenerating(true);
    setGenerateError(null);
    setGeneratedReviews(null);
    setGenProgress(null);

    try {
      const newReviews = await generateForPage(genPageSlug);
      setGeneratedReviews(newReviews);
      setReviews((prev) => [...newReviews, ...prev]);
    } catch (err: any) {
      setGenerateError(err.message || "Failed to generate reviews");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAllPages = async () => {
    const targets = getTargetPages();
    if (targets.length === 0) return;

    setIsGenerating(true);
    setGenerateError(null);
    setGeneratedReviews(null);

    const allReviews: CustomerReview[] = [];
    const failures: string[] = [];

    try {
      for (let i = 0; i < targets.length; i++) {
        const page = targets[i];
        setGenProgress({ current: i + 1, total: targets.length, page });
        try {
          const newReviews = await generateForPage(page);
          allReviews.push(...newReviews);
          setReviews((prev) => [...newReviews, ...prev]);
        } catch (err: any) {
          failures.push(`${page}: ${err.message}`);
        }
      }

      setGeneratedReviews(allReviews);

      if (failures.length > 0) {
        setGenerateError(`Some pages could not be generated:\n${failures.join("\n")}`);
      }
    } finally {
      setGenProgress(null);
      setIsGenerating(false);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/reviews?limit=1000&status=all`);
      if (!res.ok) throw new Error("Failed to load reviews.");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching reviews.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/admin/seo");
      if (res.ok) {
        const data = await res.json();
        setPages(data.pages || []);
      }
    } catch (err) {
      console.error("Failed to load pages for dropdown:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchPages();
  }, []);

  const openAddModal = () => {
    setEditingReview(null);
    setFormData({ name: "", city: "", service: "", rating: "5", quote: "", status: "pending", page_slug: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (review: CustomerReview) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      city: review.city || "",
      service: review.service || "",
      rating: String(review.rating),
      quote: review.quote,
      status: review.status || "pending",
      page_slug: review.page_slug || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete review.");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Deletion failed.");
    }
  };

  const handleUpdateStatus = async (id: string, status: "pending" | "approved" | "denied") => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status.");
      const { review } = await res.json();
      setReviews((prev) => prev.map((r) => (r.id === id ? review : r)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingReview ? `/api/admin/reviews/${editingReview.id}` : "/api/admin/reviews";
      const method = editingReview ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to save review");
      }

      const { review } = await res.json();

      if (editingReview) {
        setReviews((prev) => prev.map((r) => (r.id === review.id ? review : r)));
      } else {
        setReviews((prev) => [review, ...prev]);
      }
      
      setIsModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving review.");
    } finally {
      setIsSaving(false);
    }
  };

  // Filter based on search
  const filteredReviews = reviews.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      (r.city && r.city.toLowerCase().includes(q)) ||
      (r.service && r.service.toLowerCase().includes(q)) ||
      r.quote.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-1 flex-col gap-3 min-h-0 overflow-hidden bg-transparent">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 bg-white p-3 rounded-xl border border-neutral-200/80 shadow-xs">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-[280px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <button
            onClick={fetchReviews}
            disabled={loading}
            className="flex items-center justify-center p-1.5 border border-neutral-200 rounded-lg text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 transition disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsGenerateModalOpen(true);
              setGeneratedReviews(null);
              setGenerateError(null);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Reviews with AI
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Review
          </button>
        </div>
      </div>

      {error && (
        <div className="shrink-0 p-3 bg-red-50 text-red-700 border border-red-200/50 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden bg-white rounded-xl border border-neutral-200/80 shadow-xs flex flex-col relative">
        {loading && reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-neutral-500">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            <p className="text-xs font-medium">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-neutral-400">
            <MessageSquare className="h-10 w-10 text-neutral-200" />
            <p className="text-xs font-medium">No reviews found.</p>
          </div>
        ) : (
          <div className="overflow-auto min-h-0 flex-1 relative custom-scrollbar">
            <table className="w-full min-w-[800px] text-left text-xs whitespace-nowrap">
              <thead className="sticky top-0 bg-neutral-50 border-b border-neutral-200 shadow-sm z-10">
                <tr>
                  <th className="px-4 py-3 font-semibold text-neutral-500 uppercase tracking-wider w-[20%]">Customer</th>
                  <th className="px-4 py-3 font-semibold text-neutral-500 uppercase tracking-wider w-[15%]">Details</th>
                  <th className="px-4 py-3 font-semibold text-neutral-500 uppercase tracking-wider w-[10%]">Rating</th>
                  <th className="px-4 py-3 font-semibold text-neutral-500 uppercase tracking-wider w-[10%]">Status</th>
                  <th className="px-4 py-3 font-semibold text-neutral-500 uppercase tracking-wider max-w-xs">Quote</th>
                  <th className="px-4 py-3 font-semibold text-neutral-500 uppercase tracking-wider text-right w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100/80">
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-emerald-50/30 transition-colors group">
                    <td className="px-4 py-3 align-top">
                      <div className="font-semibold text-neutral-900">{review.name}</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">
                        {new Date(review.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col gap-1">
                        {review.city ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-neutral-600">
                            <MapPin className="h-3 w-3 text-neutral-400" /> {review.city}
                          </span>
                        ) : (
                          <span className="text-[11px] text-neutral-400 italic">No City</span>
                        )}
                        {review.service && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 text-[10px] font-medium w-fit border border-neutral-200">
                            {review.service}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating ? "fill-amber-400 text-amber-400" : "fill-neutral-100 text-neutral-200"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          review.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : review.status === "denied"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {review.status || "pending"}
                      </span>
                      {review.page_slug && (
                        <div className="text-[10px] text-neutral-500 mt-1 max-w-[100px] truncate" title={review.page_slug}>
                          📄 {review.page_slug === "/" ? "Home" : review.page_slug}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top whitespace-normal min-w-[200px] max-w-xs text-neutral-600">
                      <p className="line-clamp-2 text-[11px] leading-relaxed group-hover:line-clamp-none transition-all">
                        "{review.quote}"
                      </p>
                    </td>
                    <td className="px-4 py-3 align-top text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        {review.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(review.id, "approved")}
                              className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 rounded-md transition-colors"
                              title="Approve Review"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(review.id, "denied")}
                              className="p-1.5 text-amber-600 bg-amber-50 hover:bg-amber-100 hover:text-amber-700 rounded-md transition-colors"
                              title="Deny Review"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openEditModal(review)}
                          className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 rounded-md transition-colors"
                          title="Edit Review"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-md transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
              <h3 className="font-semibold text-sm text-neutral-900">
                {editingReview ? "Edit Review" : "Add New Review"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-neutral-600 uppercase mb-1">Customer Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                
                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-neutral-600 uppercase mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="e.g. Mumbai"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-neutral-600 uppercase mb-1">Rating</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-neutral-600 uppercase mb-1">Service</label>
                  <input
                    type="text"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="e.g. Bed Bug Treatment"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-neutral-600 uppercase mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="denied">Denied</option>
                  </select>
                </div>
                
                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-neutral-600 uppercase mb-1">Target Page</label>
                  <select
                    value={formData.page_slug || ""}
                    onChange={(e) => setFormData({ ...formData, page_slug: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="">-- All Pages (Global) --</option>
                    <option value="/">Home Page (/)</option>
                    {pages
                      .filter((p) => !["/", "/about", "/contact", "/faq", "/blog"].includes(p.path))
                      .map((p) => (
                      <option key={p.path} value={p.path}>
                        {p.title || p.path} ({p.path})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 uppercase mb-1">Review Text *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                  placeholder="What did the customer say?"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="h-3 w-3 animate-spin" />}
                  {editingReview ? "Save Changes" : "Create Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI REVIEW GENERATOR MODAL */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-100 bg-gradient-to-r from-purple-50 via-indigo-50/50 to-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">AI Customer Reviews Generator</h3>
                  <p className="text-[11px] text-neutral-500">
                    Generates authentic Indian citizen reviews with 100% unique names (zero duplication) and uniform length (20–35 words).
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:text-neutral-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto flex flex-col gap-4">
              {generateError && (
                <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200 whitespace-pre-line">
                  {generateError}
                </div>
              )}

              {genProgress && (
                <div className="rounded-xl bg-purple-50 border border-purple-200 p-3 text-xs text-purple-800 flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                  <span>
                    Generating for <strong>{genProgress.page}</strong> — page {genProgress.current} of {genProgress.total}...
                  </span>
                </div>
              )}

              {/* SUCCESS RESULTS PREVIEW */}
              {generatedReviews && generatedReviews.length > 0 ? (
                <div className="flex flex-col gap-3">
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Successfully generated and saved {generatedReviews.length} reviews!</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold uppercase bg-emerald-100 px-2 py-0.5 rounded-full">
                      Added to DB
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-neutral-700">Preview Generated Reviews (Consistent Length):</p>

                  <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                    {generatedReviews.map((rev, i) => {
                      const words = rev.quote.split(/\s+/).filter(Boolean).length;
                      return (
                        <div key={rev.id || i} className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-neutral-900">{rev.name}</span>
                              {rev.city && (
                                <span className="text-[10px] font-medium text-neutral-500 bg-white border border-neutral-200 px-1.5 py-0.5 rounded">
                                  {rev.city}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="flex text-amber-400">
                                {Array.from({ length: rev.rating }).map((_, s) => (
                                  <Star key={s} className="h-3 w-3 fill-amber-400" />
                                ))}
                              </div>
                              <span className="text-[10px] font-mono text-neutral-400 ml-1">({words} words)</span>
                            </div>
                          </div>
                          <p className="text-neutral-700 leading-relaxed italic">"{rev.quote}"</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <>
                  {/* Target Page Selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-neutral-800 flex items-center justify-between">
                      <span>Select Target Page</span>
                      <span className="text-[10px] text-neutral-400 font-normal">Review context & location</span>
                    </label>
                    <select
                      value={genPageSlug}
                      onChange={(e) => setGenPageSlug(e.target.value)}
                      disabled={isGenerating}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-900 outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/10"
                    >
                      <option value="/">Home Page (/)</option>
                      <optgroup label="Popular City Pages">
                        <option value="/bangalore">Bangalore (/bangalore)</option>
                        <option value="/mumbai">Mumbai (/mumbai)</option>
                        <option value="/pune">Pune (/pune)</option>
                      </optgroup>
                      <optgroup label="Other Website Pages">
                        {pages
                          .filter(
                            (p) =>
                              ![
                                "/",
                                ...CITY_PAGE_PATHS,
                                ...EXCLUDED_REVIEW_PAGE_PATHS,
                              ].includes(p.path)
                          )
                          .map((p) => (
                            <option key={p.path} value={p.path}>
                              {p.title || p.path} ({p.path})
                            </option>
                          ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Number of Reviews Selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-neutral-800 flex items-center justify-between">
                      <span>Number of Reviews to Generate</span>
                      <span className="text-[10px] text-neutral-400 font-normal">Max {MAX_GENERATE_COUNT} per page</span>
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {[3, 5, 10, 15, 20].map((count) => (
                        <button
                          key={count}
                          type="button"
                          disabled={isGenerating}
                          onClick={() => setGenCountInput(String(count))}
                          className={`rounded-xl border py-2 text-xs font-bold transition ${
                            genCount === count
                              ? "border-purple-600 bg-purple-50 text-purple-700 shadow-xs ring-1 ring-purple-500/20"
                              : "border-neutral-200 bg-neutral-50/50 text-neutral-600 hover:bg-neutral-100"
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>

                    {/* Custom count input */}
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[11px] font-medium text-neutral-500">Custom:</span>
                      <input
                        type="number"
                        min={1}
                        max={MAX_GENERATE_COUNT}
                        value={genCountInput}
                        disabled={isGenerating}
                        onChange={(e) => setGenCountInput(e.target.value)}
                        onBlur={() => setGenCountInput(String(genCount))}
                        placeholder="e.g. 8"
                        className="w-24 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs font-semibold text-neutral-900 outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/10 disabled:opacity-50"
                      />
                      <span className="text-[10px] text-neutral-400">
                        Type any number (1–{MAX_GENERATE_COUNT}) or pick a preset above.
                      </span>
                    </div>
                  </div>

                  {/* Rating Configuration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-neutral-800">Rating Mix</label>
                      <select
                        value={genRatingType}
                        onChange={(e) => setGenRatingType(e.target.value)}
                        disabled={isGenerating}
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-900 outline-none focus:border-purple-500"
                      >
                        <option value="mostly_5">Mostly 5★ (90% 5★, 10% 4★ - Authentic)</option>
                        <option value="all_5">All 5★ (100% 5 Stars)</option>
                        <option value="mixed">Mixed (70% 5★, 30% 4★)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-neutral-800">Publish Status</label>
                      <select
                        value={genStatus}
                        onChange={(e) => setGenStatus(e.target.value as any)}
                        disabled={isGenerating}
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-900 outline-none focus:border-purple-500"
                      >
                        <option value="approved">Approved (Show on site immediately)</option>
                        <option value="pending">Pending (Review in table first)</option>
                      </select>
                    </div>
                  </div>

                  {/* Consistency Guarantee Info Callout */}
                  <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-3 text-[11px] text-purple-900 leading-relaxed flex flex-col gap-1">
                    <span className="font-bold flex items-center gap-1.5 text-purple-800">
                      <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" /> Human-Like & Uniform Content Size
                    </span>
                    <p className="text-purple-700">
                      Reviews are strictly kept to <strong>20–35 words (1–2 sentences)</strong> with real Indian citizen names, matching cities/localities, and genuine experiences (odorless spray, mattress inspection, polite technicians).
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex flex-wrap items-center justify-end gap-2.5">
              {generatedReviews ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsGenerateModalOpen(false);
                    setGeneratedReviews(null);
                  }}
                  className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-700 transition shadow-sm"
                >
                  Done & View in Table
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsGenerateModalOpen(false)}
                    disabled={isGenerating}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateAllPages}
                    disabled={isGenerating}
                    title={`Generate ${genCount} reviews for every target page`}
                    className="flex items-center gap-1.5 rounded-xl border border-purple-300 bg-purple-50 px-4 py-2 text-xs font-bold text-purple-700 hover:bg-purple-100 transition disabled:opacity-50"
                  >
                    {genProgress ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Generating All Pages...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Generate for All Pages</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateReviews}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white hover:from-purple-700 hover:to-indigo-700 transition shadow-sm disabled:opacity-50"
                  >
                    {isGenerating && !genProgress ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Generating Reviews with OpenAI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Generate {genCount} Reviews</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
