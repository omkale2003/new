import { useState, useEffect } from "react";
import Input from "../../../../components/ui/Input/Input.jsx";
import Button from "../../../../components/ui/Button/Button.jsx";
import { X } from "lucide-react";

export function AddRateModal({ isOpen, onClose, onSave, editingRate, activities = [] }) {
  const [formData, setFormData] = useState({
    activity_id: activities[0]?.activity_id || "act_101",
    rate_name: "",
    participant_type: "Adult",
    pricing_unit: "Per Person",
    currency: "INR",
    amount: "",
    min_quantity: 1,
    max_quantity: 8,
    valid_from: "2024-01-01",
    valid_to: "2025-12-31",
    is_default: false,
    is_active: true,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editingRate) {
      setFormData(editingRate);
    } else {
      setFormData({
        activity_id: activities[0]?.activity_id || "act_101",
        rate_name: "",
        participant_type: "Adult",
        pricing_unit: "Per Person",
        currency: "INR",
        amount: "",
        min_quantity: 1,
        max_quantity: 8,
        valid_from: "2024-01-01",
        valid_to: "2025-12-31",
        is_default: false,
        is_active: true,
      });
    }
  }, [editingRate, activities, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.rate_name.trim()) {
      setError("Rate name is required.");
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError("Please specify a valid price amount.");
      return;
    }

    const selectedAct = activities.find((a) => a.activity_id === formData.activity_id);
    onSave({
      ...formData,
      activity_name: selectedAct?.name || "Activity Package",
      amount: Number(formData.amount),
      min_quantity: Number(formData.min_quantity) || 1,
      max_quantity: Number(formData.max_quantity) || 8,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl z-10">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            {editingRate ? "Edit Rate Package" : "Add New Rate Package"}
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

          <Input
            label="Rate Name"
            required
            placeholder="e.g. Adult Certified Scuba Diver Rate"
            value={formData.rate_name}
            onChange={(e) => setFormData({ ...formData, rate_name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Participant Type</label>
              <select
                value={formData.participant_type}
                onChange={(e) => setFormData({ ...formData, participant_type: e.target.value })}
                className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none focus:border-konkan-500"
              >
                <option value="Adult">Adult</option>
                <option value="Child">Child (6-12 Yrs)</option>
                <option value="Infant">Infant (&lt;6 Yrs)</option>
                <option value="Student">Student (With ID)</option>
                <option value="Senior">Senior Citizen</option>
                <option value="Any">Any / General</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Pricing Unit</label>
              <select
                value={formData.pricing_unit}
                onChange={(e) => setFormData({ ...formData, pricing_unit: e.target.value })}
                className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none focus:border-konkan-500"
              >
                <option value="Per Person">Per Person</option>
                <option value="Per Group">Per Group</option>
                <option value="Per Session">Per Session</option>
                <option value="Per Hour">Per Hour</option>
                <option value="Private">Private Charter</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Price (₹ INR)"
              required
              type="number"
              placeholder="e.g. 2499"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
            <Input
              label="Min Qty"
              type="number"
              value={formData.min_quantity}
              onChange={(e) => setFormData({ ...formData, min_quantity: e.target.value })}
            />
            <Input
              label="Max Qty"
              type="number"
              value={formData.max_quantity}
              onChange={(e) => setFormData({ ...formData, max_quantity: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Valid From"
              type="date"
              value={formData.valid_from}
              onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
            />
            <Input
              label="Valid To"
              type="date"
              value={formData.valid_to}
              onChange={(e) => setFormData({ ...formData, valid_to: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-konkan-600 focus:ring-konkan-500"
              />
              <span>Set as Default Rate for Activity</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <Button type="submit">
              {editingRate ? "Update Rate" : "Create Rate"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRateModal;

