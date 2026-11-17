import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { useActivities, useDeleteActivity, useUpdateActivityStatus } from "../hooks/useActivities.js";
import useActivityAuth from "../hooks/useActivityAuth.js";
import VerificationStatusBanner from "../components/modals/VerificationStatusBanner.jsx";
import { ACTIVITY_PROVIDER_ROUTES } from "../../../constants/routes.js";

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "Active", label: "Active" },
  { id: "Pending Review", label: "Pending Review" },
  { id: "Draft", label: "Draft" },
  { id: "Inactive", label: "Inactive" },
  { id: "Rejected", label: "Rejected" },
  { id: "Archived", label: "Archived" },
];

function getStatusBadge(status) {
  switch (status) {
    case "Active":
      return {
        pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
      };
    case "Pending Review":
      return {
        pill: "bg-blue-50 text-blue-700 border-blue-200",
        dot: "bg-blue-500",
      };
    case "Draft":
      return {
        pill: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
      };
    case "Inactive":
      return {
        pill: "bg-slate-100 text-slate-700 border-slate-200",
        dot: "bg-slate-400",
      };
    case "Rejected":
      return {
        pill: "bg-red-50 text-red-700 border-red-200",
        dot: "bg-red-500",
      };
    default:
      return {
        pill: "bg-slate-100 text-slate-600 border-slate-200",
        dot: "bg-slate-400",
      };
  }
}

export function MyActivitiesPage() {
  const navigate = useNavigate();
  const { canPublish, status: providerStatus } = useActivityAuth();

  const [activeTab, setActiveTab] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const { data, isLoading, isError, error, refetch } = useActivities({
    page,
    limit: 8,
    status: activeTab,
    search: searchTerm,
  });

  const deleteMutation = useDeleteActivity();
  const statusMutation = useUpdateActivityStatus();

  const activities = useMemo(() => data?.data || [], [data]);
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setPage(1);
  };

  const handleResetSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setPage(1);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        alert(err?.message || "Failed to delete activity.");
      }
    }
  };

  const handleToggleStatus = async (activity) => {
    const nextStatus = activity.status === "Active" ? "Inactive" : "Active";
    try {
      await statusMutation.mutateAsync({ id: activity.activity_id, status: nextStatus });
    } catch (err) {
      alert(err?.message || "Cannot change status.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <VerificationStatusBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Activities</h1>
          <p className="mt-1 text-xs text-slate-500">
            Publish and manage experience details, photos, guest capacities, and slot pricing.
          </p>
        </div>

        <Link
          to={ACTIVITY_PROVIDER_ROUTES.ADD_ACTIVITY}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-konkan-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-konkan-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Activity</span>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex overflow-x-auto gap-1 rounded-2xl bg-slate-100/80 p-1.5 text-xs font-semibold text-slate-600 scrollbar-none">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
              }}
              className={`rounded-xl px-3.5 py-2 whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full lg:w-80">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by activity name or city..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-20 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-konkan-500 focus:outline-none focus:ring-1 focus:ring-konkan-500"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleResetSearch}
              className="absolute right-12 text-slate-400 hover:text-slate-600 p-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 rounded-lg bg-konkan-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-konkan-700"
          >
            Find
          </button>
        </form>
      </div>

      {/* Listing Content */}
      {isLoading ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-solid border-konkan-600 border-r-transparent" />
          <p className="mt-3 text-xs font-medium text-slate-500">Loading activities...</p>
        </div>
      ) : isError ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
          <p className="mt-2 text-sm font-semibold">Failed to load activities</p>
          <p className="mt-1 text-xs">{error?.message || "Please try again."}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white"
          >
            Retry
          </button>
        </div>
      ) : activities.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-konkan-50 text-konkan-600 mb-4">
            <Sparkles className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No activities found</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
            {searchTerm
              ? `No activities matched your search "${searchTerm}".`
              : activeTab !== "all"
              ? `No activities currently in "${activeTab}" status.`
              : "Get started by creating your first activity listing, including rate packages and slot schedules."}
          </p>
          <div className="mt-6">
            <Link
              to={ACTIVITY_PROVIDER_ROUTES.ADD_ACTIVITY}
              className="inline-flex items-center gap-2 rounded-xl bg-konkan-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-konkan-700"
            >
              <Plus className="h-4 w-4" /> Create Activity
            </Link>
          </div>
        </div>
      ) : (
        /* Table Listing */
        <div className="rounded-3xl border border-slate-100 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 pl-6">Activity</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Experience</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Base Rate</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Last Updated</th>
                  <th className="py-3.5 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activities.map((item) => {
                  const badge = getStatusBadge(item.status);
                  return (
                    <tr key={item.activity_id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.cover_image}
                            alt={item.name}
                            className="h-12 w-12 rounded-xl object-cover shrink-0 shadow-2xs"
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-slate-900 leading-snug line-clamp-1">
                              {item.name}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">
                              {item.short_description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-slate-700">
                        {item.category_name}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                          {item.experience_type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-slate-800">{item.city}</p>
                        <p className="text-[11px] text-slate-400">{item.district}</p>
                      </td>
                      <td className="py-4 px-4 font-extrabold text-slate-900">
                        ₹{Number(item.base_price).toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${badge.pill}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                        {new Date(item.updated_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="py-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/activity-provider/activities/${item.activity_id}/edit`}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-konkan-700 transition"
                            title="Edit Activity"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item)}
                            className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                              item.status === "Active"
                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                            title="Toggle Status"
                          >
                            {item.status === "Active" ? "Pause" : "Activate"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item.activity_id, item.name)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                            title="Delete Activity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
              <p className="text-xs text-slate-500">
                Showing <span className="font-semibold">{activities.length}</span> of{" "}
                <span className="font-semibold">{pagination.total}</span> activities
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <span className="text-xs font-bold text-slate-800">
                  Page {page} of {pagination.totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyActivitiesPage;

