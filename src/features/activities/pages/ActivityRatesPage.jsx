import { useState, useMemo } from "react";
import {
  CircleDollarSign,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Tag,
  Sparkles,
} from "lucide-react";
import Button from "../../../components/ui/Button/Button.jsx";
import {
  useActivityRates,
  useCreateRate,
  useUpdateRate,
  useToggleRateStatus,
  useDeleteRate,
} from "../hooks/useActivityRates.js";
import { useActivities } from "../hooks/useActivities.js";
import AddRateModal from "../components/modals/AddRateModal.jsx";

export function ActivityRatesPage() {
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [participantFilter, setParticipantFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState(null);

  const { data: activitiesData } = useActivities({ limit: 50 });
  const activities = useMemo(() => activitiesData?.data || [], [activitiesData]);

  const { data: rates = [], isLoading } = useActivityRates({
    activity_id: selectedActivityId || undefined,
    participant_type: participantFilter !== "All" ? participantFilter : undefined,
  });

  const createMutation = useCreateRate();
  const updateMutation = useUpdateRate();
  const toggleMutation = useToggleRateStatus();
  const deleteMutation = useDeleteRate();

  const handleOpenCreate = () => {
    setEditingRate(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rate) => {
    setEditingRate(rate);
    setIsModalOpen(true);
  };

  const handleSaveRate = async (payload) => {
    try {
      if (editingRate) {
        await updateMutation.mutateAsync({ id: editingRate.rate_id, patch: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err?.message || "Failed to save rate.");
    }
  };

  const handleToggle = async (rateId) => {
    try {
      await toggleMutation.mutateAsync(rateId);
    } catch (err) {
      alert(err?.message || "Failed to toggle status.");
    }
  };

  const handleDelete = async (rateId, name) => {
    if (window.confirm(`Delete rate "${name}"?`)) {
      try {
        await deleteMutation.mutateAsync(rateId);
      } catch (err) {
        alert(err?.message || "Failed to delete rate.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pricing & Rates</h1>
          <p className="mt-1 text-xs text-slate-500">
            Configure dynamic pricing, tiered age brackets, private boat charters, and seasonal discounts.
          </p>
        </div>

        <Button type="button" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-1" /> Add Rate Package
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-2xs">
        <div className="flex-1 min-w-[200px]">
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

        <div className="w-full sm:w-56">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Participant Type
          </label>
          <select
            value={participantFilter}
            onChange={(e) => setParticipantFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-konkan-500"
          >
            <option value="All">All Types</option>
            <option value="Adult">Adult</option>
            <option value="Child">Child</option>
            <option value="Student">Student</option>
            <option value="Senior">Senior</option>
            <option value="Any">Any / Group</option>
          </select>
        </div>
      </div>

      {/* Rates Table */}
      {isLoading ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center text-xs text-slate-500">
          Loading rate plans...
        </div>
      ) : rates.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <Tag className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <p className="text-sm font-bold text-slate-800">No rates found</p>
          <p className="text-xs text-slate-500 mt-1">
            Create adult, child, or private packages for your experiences.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="mt-4 rounded-xl bg-konkan-600 px-4 py-2 text-xs font-semibold text-white"
          >
            + Create Rate
          </button>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-100 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 pl-6">Rate Package</th>
                  <th className="py-3.5 px-4">Activity</th>
                  <th className="py-3.5 px-4">Participant</th>
                  <th className="py-3.5 px-4">Pricing Unit</th>
                  <th className="py-3.5 px-4">Quantity Range</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rates.map((rate) => (
                  <tr key={rate.rate_id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{rate.rate_name}</span>
                        {rate.is_default && (
                          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.2 text-[10px] font-bold text-emerald-700">
                            Default
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{rate.rate_id}</span>
                    </td>
                    <td className="py-4 px-4 max-w-[200px] truncate font-medium text-slate-700">
                      {rate.activity_name || "Assigned Activity"}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      {rate.participant_type}
                    </td>
                    <td className="py-4 px-4 text-slate-600">{rate.pricing_unit}</td>
                    <td className="py-4 px-4 text-slate-600">
                      {rate.min_quantity} to {rate.max_quantity} pax
                    </td>
                    <td className="py-4 px-4 font-extrabold text-slate-900 text-sm">
                      ₹{Number(rate.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggle(rate.rate_id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold border transition ${
                          rate.is_active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            rate.is_active ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {rate.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(rate)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-konkan-700"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(rate.rate_id, rate.rate_name)}
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
      <AddRateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRate}
        editingRate={editingRate}
        activities={activities}
      />
    </div>
  );
}

export default ActivityRatesPage;

