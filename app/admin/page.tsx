"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Download,
  Filter,
  Inbox,
  Loader2,
  MapPin,
  MessageCircle,
  MessageSquare,
  PhoneCall,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Enquiry } from "@/lib/supabase";

type StatusType = "all" | "new" | "contacted" | "scheduled" | "completed" | "cancelled";

export default function AdminDashboardPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusType>("all");

  // Notes Modal state
  const [activeNoteEnquiry, setActiveNoteEnquiry] = useState<Enquiry | null>(null);
  const [noteText, setNoteText] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Status updating indicator per item
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch enquiries
  const fetchEnquiries = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("q", search.trim());
      if (selectedStatus !== "all") params.set("status", selectedStatus);

      const res = await fetch(`/api/admin/enquiries?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load enquiries.");
      }
      const data = await res.json();
      setEnquiries(data.enquiries || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error fetching enquiry records.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus]);

  // Handle live search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEnquiries();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Status update
  const handleStatusChange = async (
    enquiryId: string,
    newStatus: Enquiry["status"],
  ) => {
    setUpdatingId(enquiryId);
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: enquiryId, status: newStatus }),
      });

      if (!res.ok) throw new Error("Could not update status.");

      setEnquiries((prev) =>
        prev.map((item) =>
          item.id === enquiryId ? { ...item, status: newStatus } : item,
        ),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete enquiry
  const handleDelete = async (enquiryId: string) => {
    if (!confirm("Are you sure you want to delete this enquiry record?")) return;

    try {
      const res = await fetch(`/api/admin/enquiries?id=${enquiryId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Could not delete record.");

      setEnquiries((prev) => prev.filter((item) => item.id !== enquiryId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Deletion failed.");
    }
  };

  // Save notes
  const handleSaveNote = async () => {
    if (!activeNoteEnquiry) return;
    setIsSavingNote(true);
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeNoteEnquiry.id,
          notes: noteText.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to save notes.");

      setEnquiries((prev) =>
        prev.map((item) =>
          item.id === activeNoteEnquiry.id
            ? { ...item, notes: noteText.trim() }
            : item,
        ),
      );
      setActiveNoteEnquiry(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not save notes.");
    } finally {
      setIsSavingNote(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (enquiries.length === 0) {
      alert("No records to export.");
      return;
    }

    const headers = [
      "Date",
      "Name",
      "Phone",
      "City",
      "Property",
      "Status",
      "Message",
      "Notes",
    ];

    const rows = enquiries.map((e) => [
      `"${new Date(e.created_at).toLocaleString("en-IN")}"`,
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.phone}"`,
      `"${(e.city || "").replace(/"/g, '""')}"`,
      `"${(e.property_type || "").replace(/"/g, '""')}"`,
      `"${e.status}"`,
      `"${(e.message || "").replace(/"/g, '""')}"`,
      `"${(e.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `enquiries_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-1 flex-col gap-3 min-h-0 overflow-hidden bg-transparent">
      {/* Sleek Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0 rounded-xl bg-white p-2 shadow-sm border border-neutral-200/80">
        <div className="flex flex-1 items-center gap-3 min-w-[300px]">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, city..."
              className="w-full rounded-lg bg-neutral-100/50 py-2 pl-9 pr-4 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:bg-neutral-100 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Status Filters */}
          <div className="hidden md:flex items-center gap-1 border-l border-neutral-200 pl-3">
            <Filter className="h-3.5 w-3.5 text-neutral-400 mr-1" />
            {(
              [
                "all",
                "new",
                "contacted",
                "scheduled",
                "completed",
                "cancelled",
              ] as StatusType[]
            ).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium capitalize transition ${
                  selectedStatus === st
                    ? "bg-neutral-800 text-white shadow-xs"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchEnquiries}
            disabled={loading}
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 text-[11px] font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-[11px] font-medium text-white shadow-sm hover:bg-emerald-700 transition"
          >
            <Download className="h-3 w-3" />
            Export
          </button>
        </div>
      </div>

      {/* Simplified Table */}
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-1 items-center justify-center py-10 text-neutral-400">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            <span className="ml-2 text-xs font-medium text-neutral-600">
              Loading...
            </span>
          </div>
        ) : error ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-red-600">
            <AlertCircle className="h-6 w-6" />
            <p className="mt-2 text-xs font-medium">{error}</p>
            <button
              onClick={fetchEnquiries}
              className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
            >
              Retry
            </button>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-neutral-400">
            <Inbox className="h-8 w-8 text-neutral-300 mb-2" />
            <h3 className="text-sm font-medium text-neutral-800">
              No enquiries found
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 z-10 border-b border-neutral-200 bg-white text-[11px] font-medium tracking-wide text-neutral-500">
                <tr>
                  <th className="py-3 pl-5 pr-4">Date</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 pl-4 pr-5 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {enquiries.map((item) => {
                  const whatsappUrl = `https://wa.me/91${item.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hi ${item.name}, thank you for contacting us. How can we help you today?`,
                  )}`;
                  const phoneUrl = `tel:+91${item.phone.replace(/\D/g, "")}`;

                  return (
                    <tr
                      key={item.id}
                      className="group hover:bg-neutral-50/60 transition-colors"
                    >
                      {/* Date */}
                      <td className="py-3 pl-5 pr-4 align-top text-neutral-500 whitespace-nowrap">
                        <div className="font-medium text-neutral-700">
                          {new Date(item.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">
                          {new Date(item.created_at).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </div>
                      </td>

                      {/* Customer Details */}
                      <td className="py-3 px-4 align-top">
                        <div className="font-semibold text-neutral-900 mb-0.5">
                          {item.name}
                        </div>
                        <div className="flex flex-col gap-0.5 text-[11px] text-neutral-500">
                          {item.city && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-neutral-400" />
                              {item.city} {item.property_type && `(${item.property_type})`}
                            </div>
                          )}
                          {item.message && (
                            <p className="mt-1 max-w-xs truncate text-neutral-600">
                              "{item.message}"
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4 align-top whitespace-nowrap">
                        <div className="font-mono font-medium text-neutral-800 mb-1.5">
                          +91 {item.phone}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={phoneUrl}
                            className="inline-flex h-6 items-center gap-1 rounded bg-neutral-100 px-2 text-[10px] font-medium text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 transition"
                          >
                            <PhoneCall className="h-3 w-3" />
                            Call
                          </a>
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-6 items-center gap-1 rounded bg-emerald-50 px-2 text-[10px] font-medium text-emerald-700 hover:bg-emerald-100 transition"
                          >
                            <MessageCircle className="h-3 w-3" />
                            Chat
                          </a>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 align-top">
                        <select
                          value={item.status}
                          disabled={updatingId === item.id}
                          onChange={(e) =>
                            handleStatusChange(
                              item.id,
                              e.target.value as Enquiry["status"],
                            )
                          }
                          className={`w-full max-w-[120px] rounded border border-transparent bg-neutral-100 py-1 pl-2 pr-6 text-[11px] font-medium text-neutral-700 outline-none hover:bg-neutral-200 focus:border-emerald-500 focus:bg-white transition cursor-pointer ${
                            updatingId === item.id ? "opacity-50" : ""
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Notes */}
                      <td className="py-3 px-4 align-top max-w-[200px]">
                        {item.notes ? (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveNoteEnquiry(item);
                              setNoteText(item.notes || "");
                            }}
                            className="truncate text-left text-[11px] text-neutral-600 hover:text-neutral-900 block w-full"
                          >
                            {item.notes}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveNoteEnquiry(item);
                              setNoteText("");
                            }}
                            className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-emerald-600 transition"
                          >
                            <MessageSquare className="h-3 w-3" />
                            Add note
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 pl-4 pr-5 align-top text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="rounded p-1 text-neutral-300 hover:bg-red-50 hover:text-red-600 transition opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Technician Notes Modal */}
      {activeNoteEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-900">
                Notes for {activeNoteEnquiry.name}
              </h3>
              <button
                type="button"
                onClick={() => setActiveNoteEnquiry(null)}
                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add technician remarks..."
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-emerald-500 focus:bg-white transition"
            />

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveNoteEnquiry(null)}
                className="rounded-lg px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                disabled={isSavingNote}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60 transition"
              >
                {isSavingNote && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
