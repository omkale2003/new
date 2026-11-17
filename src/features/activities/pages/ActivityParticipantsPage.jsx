import { useState, useMemo } from "react";
import { Users2, Search, Filter, ShieldCheck, AlertCircle, FileCheck, RotateCcw } from "lucide-react";
import { useActivityParticipants } from "../hooks/useActivityBookings.js";
import { useActivities } from "../hooks/useActivities.js";

export function ActivityParticipantsPage() {
  const [waiverFilter, setWaiverFilter] = useState("All");
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [search, setSearch] = useState("");

  const { data: activitiesData } = useActivities({ limit: 50 });
  const activities = useMemo(() => activitiesData?.data || [], [activitiesData]);

  const { data: participants = [], isLoading } = useActivityParticipants({
    waiver_status: waiverFilter !== "All" ? waiverFilter : undefined,
    activity_id: selectedActivityId || undefined,
    search: search.trim() || undefined,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Guest Manifests & Participants
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Safety roster, liability waivers, medical disclosures, and emergency contact registry.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-2xs">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Search Participant or Code
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Guest name or KT-ACT code..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs font-semibold text-slate-800 outline-none focus:border-konkan-500"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Filter by Activity
          </label>
          <select
            value={selectedActivityId}
            onChange={(e) => setSelectedActivityId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-konkan-500"
          >
            <option value="">All Activities</option>
            {activities.map((a) => (
              <option key={a.activity_id} value={a.activity_id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Waiver Status
          </label>
          <select
            value={waiverFilter}
            onChange={(e) => setWaiverFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-konkan-500"
          >
            <option value="All">All Waiver States</option>
            <option value="Signed">Signed & Acknowledged</option>
            <option value="Pending">Pending Signature</option>
          </select>
        </div>
      </div>

      {/* Participants Table */}
      {isLoading ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center text-xs text-slate-500">
          Loading guest roster...
        </div>
      ) : participants.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <Users2 className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <p className="text-sm font-bold text-slate-800">No participants found</p>
          <p className="text-xs text-slate-500 mt-1">
            Guest rosters appear once online reservations are completed.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-100 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 pl-6">Participant</th>
                  <th className="py-3.5 px-4">Type / Age</th>
                  <th className="py-3.5 px-4">Weight</th>
                  <th className="py-3.5 px-4">Booking Ref</th>
                  <th className="py-3.5 px-4">Activity & Slot</th>
                  <th className="py-3.5 px-4">Emergency Contact</th>
                  <th className="py-3.5 px-4">Special Medical Notes</th>
                  <th className="py-3.5 pr-6 text-right">Waiver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {participants.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 pl-6">
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-[11px] text-slate-400">Booked by {p.customer_name}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-800">{p.type}</span>
                      <span className="text-slate-400 ml-1">({p.age} yrs)</span>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-700">{p.weight_kg} kg</td>
                    <td className="py-4 px-4 font-mono font-semibold text-konkan-800">
                      {p.booking_code}
                    </td>
                    <td className="py-4 px-4 max-w-[200px]">
                      <p className="font-semibold text-slate-800 truncate">{p.activity_name}</p>
                      <p className="text-[11px] text-slate-400">
                        {p.slot_date} • {p.slot_time}
                      </p>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      {p.emergency_contact}
                    </td>
                    <td className="py-4 px-4 text-slate-600 max-w-[180px] truncate">
                      {p.special_requirements || "None"}
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          p.waiver_status === "Signed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {p.waiver_status === "Signed" ? "✓ Signed" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityParticipantsPage;

