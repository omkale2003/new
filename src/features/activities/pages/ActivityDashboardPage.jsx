import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  Sparkles,
  CalendarDays,
  Ticket,
  Clock,
  CircleDollarSign,
  Plus,
  ArrowRight,
  TrendingUp,
  Users2,
  CalendarClock,
  ShieldCheck,
  MapPin,
  Eye,
  CheckCircle2,
} from "lucide-react";
import useActivityAuth from "../hooks/useActivityAuth.js";
import { useActivities } from "../hooks/useActivities.js";
import { useActivityBookings } from "../hooks/useActivityBookings.js";
import { useActivitySlots } from "../hooks/useActivitySlots.js";
import VerificationStatusBanner from "../components/modals/VerificationStatusBanner.jsx";
import { ACTIVITY_PROVIDER_ROUTES } from "../../../constants/routes.js";

export function ActivityDashboardPage() {
  const { vendor, status, canPublish } = useActivityAuth();
  const [dateRange, setDateRange] = useState("This Month");

  const { data: activitiesData, isLoading: isActivitiesLoading } = useActivities({ limit: 50 });
  const { data: bookingsData, isLoading: isBookingsLoading } = useActivityBookings({ limit: 50 });
  const { data: slotsData, isLoading: isSlotsLoading } = useActivitySlots();

  const activities = useMemo(() => activitiesData?.data || [], [activitiesData]);
  const bookings = useMemo(() => bookingsData?.data || [], [bookingsData]);
  const slots = useMemo(() => slotsData || [], [slotsData]);

  // Derived metrics
  const totalActivities = activitiesData?.pagination?.total ?? activities.length;
  const activeActivities = activities.filter((a) => a.status === "Active").length;
  const pendingReviewActivities = activities.filter((a) => a.status === "Pending Review").length;
  const draftActivities = activities.filter((a) => a.status === "Draft").length;

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.booking_status === "Confirmed").length;
  const totalRevenue = bookings
    .filter((b) => b.booking_status === "Confirmed" || b.booking_status === "Completed")
    .reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);

  const upcomingBookings = bookings.filter((b) => b.booking_status === "Confirmed").slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Verification Banner */}
      <VerificationStatusBanner />

      {/* Dashboard Top Welcome & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back, {vendor?.business_name || vendor?.first_name || "Provider"}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Monitor real-time guest slots, water sport reservations, and activity listings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-600">
            {["Today", "This Week", "This Month"].map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setDateRange(range)}
                className={`rounded-lg px-3 py-1.5 transition ${
                  dateRange === range ? "bg-white text-slate-900 shadow-2xs" : "hover:text-slate-900"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <Link
            to={ACTIVITY_PROVIDER_ROUTES.ADD_ACTIVITY}
            className="inline-flex items-center gap-2 rounded-xl bg-konkan-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-konkan-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Create Activity</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Activities */}
        <div className="rounded-2xl border border-slate-100/80 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-konkan-50 text-konkan-600">
              <Sparkles className="h-6 w-6" strokeWidth={1.9} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500 truncate">Total Activities</p>
              <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
                {totalActivities}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 pt-3 border-t border-slate-50 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {activeActivities} Active
            </span>
            <span className="inline-flex items-center gap-1.5 text-amber-700 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {pendingReviewActivities} In Review
            </span>
          </div>
        </div>

        {/* Card 2: Total Bookings */}
        <div className="rounded-2xl border border-slate-100/80 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Ticket className="h-6 w-6" strokeWidth={1.9} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500 truncate">Total Bookings</p>
              <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
                {totalBookings}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-50 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
              <TrendingUp className="h-3.5 w-3.5" /> +18.4%
            </span>
            <span className="text-slate-400">vs last month</span>
          </div>
        </div>

        {/* Card 3: Upcoming Bookings */}
        <div className="rounded-2xl border border-slate-100/80 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <CalendarClock className="h-6 w-6" strokeWidth={1.9} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500 truncate">Upcoming Bookings</p>
              <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
                {confirmedBookings}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-50 text-xs">
            <span className="text-slate-500">Requires slot dispatch</span>
            <Link
              to={ACTIVITY_PROVIDER_ROUTES.BOOKINGS}
              className="font-semibold text-konkan-700 hover:underline"
            >
              View all
            </Link>
          </div>
        </div>

        {/* Card 4: Gross Revenue */}
        <div className="rounded-2xl border border-slate-100/80 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CircleDollarSign className="h-6 w-6" strokeWidth={1.9} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500 truncate">Gross Activity Revenue</p>
              <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-50 text-xs">
            <span className="text-emerald-700 font-semibold">Direct UPI & Gateway</span>
            <span className="text-slate-400">Net payout ₹{(totalRevenue * 0.95).toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Activity Overview, Right Quick Actions & Slots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recent Bookings & Activities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Bookings Table */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Guest Reservations</h3>
                <p className="text-xs text-slate-500">Latest confirmed bookings across your experiences</p>
              </div>
              <Link
                to={ACTIVITY_PROVIDER_ROUTES.BOOKINGS}
                className="text-xs font-semibold text-konkan-700 hover:underline inline-flex items-center gap-1"
              >
                View all bookings <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-3 pl-2">Booking Code</th>
                    <th className="pb-3">Guest</th>
                    <th className="pb-3">Activity</th>
                    <th className="pb-3">Slot</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3 pr-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.slice(0, 4).map((b) => (
                    <tr key={b.booking_id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 pl-2 font-mono font-semibold text-slate-800">
                        {b.booking_code}
                      </td>
                      <td className="py-3">
                        <p className="font-semibold text-slate-900">{b.customer_name}</p>
                        <p className="text-[11px] text-slate-400">{b.total_guests} Guests</p>
                      </td>
                      <td className="py-3 max-w-[200px] truncate font-medium text-slate-700">
                        {b.activity_name}
                      </td>
                      <td className="py-3">
                        <p className="text-slate-800">{b.slot_date}</p>
                        <p className="text-[11px] text-slate-400 truncate">{b.slot_time}</p>
                      </td>
                      <td className="py-3 font-semibold text-slate-900">
                        ₹{Number(b.total_amount).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            b.booking_status === "Confirmed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : b.booking_status === "Completed"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : b.booking_status === "Pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {b.booking_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Performance Overview */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Activity Performance Overview</h3>
                <p className="text-xs text-slate-500">Live operational status and pricing</p>
              </div>
              <Link
                to={ACTIVITY_PROVIDER_ROUTES.ACTIVITIES}
                className="text-xs font-semibold text-konkan-700 hover:underline"
              >
                Manage list
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activities.slice(0, 4).map((act) => (
                <div
                  key={act.activity_id}
                  className="rounded-2xl border border-slate-100 p-4 hover:border-slate-200 transition bg-slate-50/40"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={act.cover_image}
                      alt={act.name}
                      className="h-14 w-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{act.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" /> {act.city}, {act.district}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-konkan-700">
                          ₹{act.base_price}{" "}
                          <span className="text-[10px] font-normal text-slate-500">onwards</span>
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            act.status === "Active"
                              ? "bg-emerald-50 text-emerald-700"
                              : act.status === "Pending Review"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {act.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions & Slot Availability */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Quick Actions</h3>

            <div className="space-y-2">
              <Link
                to={ACTIVITY_PROVIDER_ROUTES.ADD_ACTIVITY}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-konkan-500 hover:bg-konkan-50/40 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-konkan-100 text-konkan-700">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Add New Activity</p>
                    <p className="text-[11px] text-slate-500">Launch water sport, trek, or dive</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-konkan-600" />
              </Link>

              <Link
                to={ACTIVITY_PROVIDER_ROUTES.AVAILABILITY}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-konkan-500 hover:bg-konkan-50/40 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                    <CalendarClock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Manage Slot Schedule</p>
                    <p className="text-[11px] text-slate-500">Open or block upcoming time slots</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-konkan-600" />
              </Link>

              <Link
                to={ACTIVITY_PROVIDER_ROUTES.PRICING}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-konkan-500 hover:bg-konkan-50/40 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                    <CircleDollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Rates & Tiered Pricing</p>
                    <p className="text-[11px] text-slate-500">Adult, child & group packages</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-konkan-600" />
              </Link>

              <Link
                to={ACTIVITY_PROVIDER_ROUTES.PARTICIPANTS}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-konkan-500 hover:bg-konkan-50/40 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                    <Users2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Guest Manifests & Waivers</p>
                    <p className="text-[11px] text-slate-500">Emergency contacts & waivers</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-konkan-600" />
              </Link>
            </div>
          </div>

          {/* Today's Slots Glance */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Today's Schedule & Slots</h3>
              <span className="text-[11px] font-semibold text-slate-500">Nov 15, 2024</span>
            </div>

            <div className="mt-4 space-y-3">
              {slots.slice(0, 4).map((s) => (
                <div
                  key={s.slot_id}
                  className="rounded-xl border border-slate-100 p-3 bg-slate-50/60 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">{s.start_time} - {s.end_time}</p>
                    <p className="text-[11px] text-slate-500 truncate max-w-[150px]">{s.activity_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-slate-800">
                      {s.booked_count} / {s.capacity} Booked
                    </p>
                    <span
                      className={`inline-block mt-0.5 rounded-full px-2 py-0.2 text-[9px] font-bold ${
                        s.status === "Available"
                          ? "bg-emerald-100 text-emerald-800"
                          : s.status === "Full"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityDashboardPage;

