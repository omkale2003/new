import { useState, useEffect } from "react";
import Input from "../../../../components/ui/Input/Input.jsx";
import Button from "../../../../components/ui/Button/Button.jsx";
import { X } from "lucide-react";

export function AddSlotModal({ isOpen, onClose, onSave, editingSlot, activities = [] }) {
  const [formData, setFormData] = useState({
    activity_id: activities[0]?.activity_id || "act_101",
    activity_date: "2024-11-20",
    start_time: "09:00",
    end_time: "11:00",
    capacity: 8,
    booking_cutoff_hours: 2,
    status: "Available",
    special_price: "",
    notes: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editingSlot) {
      setFormData(editingSlot);
    } else {
      setFormData({
        activity_id: activities[0]?.activity_id || "act_101",
        activity_date: "2024-11-20",
        start_time: "09:00",
        end_time: "11:00",
        capacity: 8,
        booking_cutoff_hours: 2,
        status: "Available",
        special_price: "",
        notes: "",
      });
    }
  }, [editingSlot, activities, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.activity_date) {
      setError("Activity date is required.");
      return;
    }
    if (!formData.start_time || !formData.end_time) {
      setError("Start and end times are required.");
      return;
    }

    const selectedAct = activities.find((a) => a.activity_id === formData.activity_id);
    onSave({
      ...formData,
      activity_name: selectedAct?.name || "Activity Session",
      capacity: Number(formData.capacity) || 8,
      booking_cutoff_hours: Number(formData.booking_cutoff_hours) || 2,
      special_price: formData.special_price ? Number(formData.special_price) : null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl z-10">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            {editingSlot ? "Edit Schedule Slot" : "Add Time Slot"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Associated Activity</label>
            <select
              value={formData.activity_id}
              onChange={(e) => setFormData({ ...formData, activity_id: e.target.value })}
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none focus:border-konkan-500"
            >
              {activities.map((a) => (
                <option key={a.activity_id} value={a.activity_id}>
                  {a.name} ({a.city})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Date"
              required
              type="date"
              value={formData.activity_date}
              onChange={(e) => setFormData({ ...formData, activity_date: e.target.value })}
            />
            <Input
              label="Start Time"
              required
              type="time"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            />
            <Input
              label="End Time"
              required
              type="time"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Total Capacity"
              required
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            />
            <Input
              label="Booking Cutoff (Hours)"
              type="number"
              value={formData.booking_cutoff_hours}
              onChange={(e) => setFormData({ ...formData, booking_cutoff_hours: e.target.value })}
            />
            <Input
              label="Special Price Override"
              type="number"
              placeholder="e.g. 2999"
              value={formData.special_price}
              onChange={(e) => setFormData({ ...formData, special_price: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Slot Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none focus:border-konkan-500"
            >
              <option value="Available">Available (Open for booking)</option>
              <option value="Blocked">Blocked (Maintenance / Reserved)</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <Input
            label="Internal Notes / Tidal Alert"
            placeholder="e.g. Calm morning waters, slack tide"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <Button type="submit">
              {editingSlot ? "Update Slot" : "Add Slot Schedule"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSlotModal;

