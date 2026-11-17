import { useState, useMemo } from "react";
import {
  CalendarClock,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
} from "lucide-react";
import Button from "../../../components/ui/Button/Button.jsx";
import {
  useActivitySlots,
  useCreateSlot,
  useUpdateSlot,
  useBlockSlot,
  useUnblockSlot,
  useCancelSlot,
  useDeleteSlot,
} from "../hooks/useActivitySlots.js";
import { useActivities } from "../hooks/useActivities.js";
import AddSlotModal from "../components/modals/AddSlotModal.jsx";

export function ActivitySlotsPage() {
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  const { data: activitiesData } = useActivities({ limit: 50 });
  const activities = useMemo(() => activitiesData?.data || [], [activitiesData]);

  const { data: slots = [], isLoading } = useActivitySlots({
    activity_id: selectedActivityId || undefined,
    status: statusFilter !== "All" ? statusFilter : undefined,
    date: dateFilter || undefined,
  });

  const createMutation = useCreateSlot();
  const updateMutation = useUpdateSlot();
  const blockMutation = useBlockSlot();
  const unblockMutation = useUnblockSlot();
  const cancelMutation = useCancelSlot();
  const deleteMutation = useDeleteSlot();

  const handleOpenCreate = () => {
    setEditingSlot(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slot) => {
    setEditingSlot(slot);
    setIsModalOpen(true);
  };

  const handleSaveSlot = async (payload) => {
    try {
      if (editingSlot) {
        await updateMutation.mutateAsync({ id: editingSlot.slot_id, patch: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err?.message || "Failed to save slot.");
    }
  };

  const handleToggleBlock = async (slot) => {
    try {
      if (slot.status === "Blocked") {
        await unblockMutation.mutateAsync(slot.slot_id);
      } else {
        await blockMutation.mutateAsync(slot.slot_id);
      }
    } catch (err) {
      alert(err?.message || "Failed to toggle block.");
    }
  };

  const handleCancelSlot = async (slotId) => {
    if (window.confirm("Cancel this slot? Guests will be alerted.")) {
      try {
        await cancelMutation.mutateAsync(slotId);
      } catch (err) {
        alert(err?.message || "Failed to cancel slot.");
      }
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (window.confirm("Delete this slot permanently?")) {
      try {
        await deleteMutation.mutateAsync(slotId);
      } catch (err) {
        alert(err?.message || "Failed to delete slot.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Availability & Slots
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Manage daily dive batches, boat schedules, capacity thresholds, and maintenance blocks.
          </p>
        </div>

        <Button type="button" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-1" /> Add Time Slot
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-2xs">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Filter by Activity
          </label>
          <select
            value={selectedActivityId}
            onChange={(e) => setSelectedActivityId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-konkan-500"
          >
            <option value="">All Activities ({activities.length})</option>
            {activities.map((a) => (
              <option key={a.activity_id} value={a.activity_id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Filter by Date
          </label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-konkan-500"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Slot Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-konkan-500"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Filling Fast">Filling Fast</option>
            <option value="Full">Full</option>
            <option value="Blocked">Blocked</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Slots Table */}
      {isLoading ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center text-xs text-slate-500">
          Loading slots schedule...
        </div>
      ) : slots.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <CalendarClock className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <p className="text-sm font-bold text-slate-800">No scheduled slots found</p>
          <p className="text-xs text-slate-500 mt-1">
            Create departure or activity slots for your tourists.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="mt-4 rounded-xl bg-konkan-600 px-4 py-2 text-xs font-semibold text-white"
          >
            + Schedule New Slot
          </button>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-100 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 pl-6">Date & Time</th>
                  <th className="py-3.5 px-4">Activity</th>
                  <th className="py-3.5 px-4">Capacity / Booked</th>
                  <th className="py-3.5 px-4">Booking Cutoff</th>
                  <th className="py-3.5 px-4">Special Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {slots.map((s) => (
                  <tr key={s.slot_id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{s.activity_date}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-semibold text-konkan-800">
                          {s.start_time} - {s.end_time}
                        </span>
                      </div>
                      {s.notes && <p className="text-[11px] text-slate-500 mt-0.5">{s.notes}</p>}
                    </td>
                    <td className="py-4 px-4 max-w-[200px] truncate font-medium text-slate-700">
                      {s.activity_name || "Activity Session"}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {s.booked_count} / {s.capacity}
                        </span>
                        <div className="h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full ${
                              s.booked_count >= s.capacity ? "bg-rose-500" : "bg-teal-500"
                            }`}
                            style={{
                              width: `${Math.min(100, (s.booked_count / s.capacity) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {s.booking_cutoff_hours} hours prior
                    </td>
                    <td className="py-4 px-4">
                      {s.special_price ? (
                        <span className="font-bold text-amber-700">₹{s.special_price}</span>
                      ) : (
                        <span className="text-slate-400">Default rate</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          s.status === "Available"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : s.status === "Full"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : s.status === "Filling Fast"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : s.status === "Blocked"
                            ? "bg-slate-200 text-slate-800 border-slate-300"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleBlock(s)}
                          className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                            s.status === "Blocked"
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                          title="Block / Unblock"
                        >
                          {s.status === "Blocked" ? "Unblock" : "Block"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(s)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-konkan-700"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSlot(s.slot_id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AddSlotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSlot}
        editingSlot={editingSlot}
        activities={activities}
      />
    </div>
  );
}

export default ActivitySlotsPage;

