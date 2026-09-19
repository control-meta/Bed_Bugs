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

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Review
        </button>
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
            <table className="w-full text-left text-xs whitespace-nowrap">
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
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
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
                      .filter((p) => !["/", "/about", "/faq", "/blog"].includes(p.path))
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
    </div>
  );
}
