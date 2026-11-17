import { useState, useMemo } from "react";
import {
  Ticket,
  Search,
  Filter,
  Eye,
  Calendar,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useActivityBookings,
  useUpdateBookingStatus,
} from "../hooks/useActivityBookings.js";
import { useActivities } from "../hooks/useActivities.js";
import BookingDetailModal from "../components/modals/BookingDetailModal.jsx";

const BOOKING_STATUS_FILTERS = [
  "All",
  "Confirmed",
  "Pending",
  "Held",
  "Completed",
  "Cancelled",
  "Rejected",
  "No Show",
  "Refunded",
];

function getStatusBadge(status) {
  switch (status) {
    case "Confirmed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Completed":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Held":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "Cancelled":
    case "Rejected":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "No Show":
      return "bg-slate-200 text-slate-700 border-slate-300";
    case "Refunded":
      return "bg-purple-50 text-purple-700 border-purple-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export function ActivityBookingsPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const [activeBookingModal, setActiveBookingModal] = useState(null);

  const { data: activitiesData } = useActivities({ limit: 50 });
  const activities = useMemo(() => activitiesData?.data || [], [activitiesData]);

  const { data, isLoading } = useActivityBookings({
    page,
    limit: 10,
    status: statusFilter,
    activity_id: selectedActivityId || undefined,
    search: searchQuery,
  });

  const updateStatusMutation = useUpdateBookingStatus();

  const bookings = useMemo(() => data?.data || [], [data]);
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleResetSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setPage(1);
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ bookingId, status: newStatus });
      if (activeBookingModal && activeBookingModal.booking_id === bookingId) {
        setActiveBookingModal((prev) => ({ ...prev, booking_status: newStatus }));
      }
    } catch (err) {
      alert(err?.message || "Failed to update booking status.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Booking Reservations
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Track confirmed guest slots, payment statuses, participant rosters, and waiver documents.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto gap-1 rounded-2xl bg-slate-100/80 p-1.5 text-xs font-semibold text-slate-600 scrollbar-none">
        {BOOKING_STATUS_FILTERS.map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => {
              setStatusFilter(st);
              setPage(1);
            }}
            className={`rounded-xl px-3.5 py-2 whitespace-nowrap transition ${
              statusFilter === st
                ? "bg-white text-slate-900 shadow-2xs font-bold"
                : "hover:text-slate-900"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Search & Activity Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none top-3.5" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by guest name, booking code KT-ACT..., or phone..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-20 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-konkan-500 focus:outline-none"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleResetSearch}
              className="absolute right-14 top-3 text-slate-400 hover:text-slate-600"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-2 rounded-xl bg-konkan-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-konkan-700"
          >
            Search
          </button>
        </form>

        <div className="w-full sm:w-72">
          <select
            value={selectedActivityId}
            onChange={(e) => {
              setSelectedActivityId(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-konkan-500"
          >
            <option value="">All Activities</option>
            {activities.map((a) => (
              <option key={a.activity_id} value={a.activity_id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      {isLoading ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center text-xs text-slate-500">
          Loading reservations...
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <Ticket className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <p className="text-sm font-bold text-slate-800">No bookings found</p>
          <p className="text-xs text-slate-500 mt-1">
            Reservations made by tourists will appear here with instant dispatch manifests.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-100 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 pl-6">Booking Code</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Activity</th>
                  <th className="py-3.5 px-4">Slot Date & Time</th>
                  <th className="py-3.5 px-4">Guests</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Booking Status</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.booking_id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 pl-6">
                      <span className="font-mono font-bold text-slate-900">{b.booking_code}</span>
                      <p className="text-[10px] text-slate-400">
                        {new Date(b.booking_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900">{b.customer_name}</p>
                      <p className="text-[11px] text-slate-500">{b.customer_phone}</p>
                    </td>
                    <td className="py-4 px-4 max-w-[200px] truncate font-medium text-slate-700">
                      {b.activity_name}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-slate-800">{b.slot_date}</p>
                      <p className="text-[11px] text-slate-400">{b.slot_time}</p>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-800">{b.total_guests} pax</td>
                    <td className="py-4 px-4 font-extrabold text-slate-900">
                      ₹{Number(b.total_amount).toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${getStatusBadge(
                          b.booking_status
                        )}`}
                      >
                        {b.booking_status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                          b.payment_status === "Paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {b.payment_status}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveBookingModal(b)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-konkan-700 hover:bg-konkan-50"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
              <p className="text-xs text-slate-500">
                Showing <span className="font-semibold">{bookings.length}</span> of{" "}
                <span className="font-semibold">{pagination.total}</span> bookings
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-slate-800">
                  {page} / {pagination.totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Booking Detail Modal */}
      <BookingDetailModal
        booking={activeBookingModal}
        isOpen={Boolean(activeBookingModal)}
        onClose={() => setActiveBookingModal(null)}
        onUpdateStatus={handleStatusUpdate}
      />
    </div>
  );
}

export default ActivityBookingsPage;

