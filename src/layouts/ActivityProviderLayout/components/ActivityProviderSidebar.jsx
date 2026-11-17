import {
  Compass,
  LayoutDashboard,
  Sparkles,
  PlusCircle,
  CalendarClock,
  CircleDollarSign,
  Image as ImageIcon,
  Ticket,
  Users2,
  Building,
  Settings,
  ShieldCheck,
  AlertCircle,
  Clock,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import useActivityAuth from "../../../features/activities/hooks/useActivityAuth.js";
import { ACTIVITY_PROVIDER_ROUTES } from "../../../constants/routes.js";

const mainNavigationItems = [
  {
    label: "Dashboard",
    path: ACTIVITY_PROVIDER_ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "My Activities",
    path: ACTIVITY_PROVIDER_ROUTES.ACTIVITIES,
    icon: Sparkles,
  },
  {
    label: "Add Activity",
    path: ACTIVITY_PROVIDER_ROUTES.ADD_ACTIVITY,
    icon: PlusCircle,
  },
  {
    label: "Availability & Slots",
    path: ACTIVITY_PROVIDER_ROUTES.AVAILABILITY,
    icon: CalendarClock,
  },
  {
    label: "Pricing & Rates",
    path: ACTIVITY_PROVIDER_ROUTES.PRICING,
    icon: CircleDollarSign,
  },
  {
    label: "Media Gallery",
    path: ACTIVITY_PROVIDER_ROUTES.MEDIA,
    icon: ImageIcon,
  },
  {
    label: "Bookings",
    path: ACTIVITY_PROVIDER_ROUTES.BOOKINGS,
    icon: Ticket,
  },
  {
    label: "Participants",
    path: ACTIVITY_PROVIDER_ROUTES.PARTICIPANTS,
    icon: Users2,
  },
];

const accountNavigationItems = [
  {
    label: "Business Profile",
    path: ACTIVITY_PROVIDER_ROUTES.PROFILE,
    icon: Building,
  },
  {
    label: "Settings",
    path: ACTIVITY_PROVIDER_ROUTES.SETTINGS,
    icon: Settings,
  },
];

function getStatusBadge(status) {
  switch (status) {
    case "Active":
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: ShieldCheck,
        text: "Active",
      };
    case "Pending Review":
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock,
        text: "In Review",
      };
    case "Pending Verification":
      return {
        bg: "bg-blue-50 text-blue-700 border-blue-200",
        icon: AlertCircle,
        text: "Verify OTP",
      };
    default:
      return {
        bg: "bg-slate-100 text-slate-700 border-slate-200",
        icon: AlertCircle,
        text: status || "Pending",
      };
  }
}

export function ActivityProviderSidebar() {
  const { vendor, status } = useActivityAuth();
  const statusBadge = getStatusBadge(status);
  const StatusIcon = statusBadge.icon;

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-slate-100 bg-white lg:flex">
      {/* Brand & Portal Header */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-konkan-700 to-teal-500 text-white shadow-sm">
          <Compass className="h-6 w-6" strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="m-0 text-xl font-bold tracking-tight text-konkan-800 leading-tight truncate">
            KonkanTrip<span className="text-xs align-top font-semibold text-konkan-600">™</span>
          </h1>
          <p className="m-0 mt-0.5 text-xs text-slate-500 font-medium truncate">
            Activities Provider Portal
          </p>
        </div>
      </div>

      {/* Account Verification Indicator */}
      <div className="border-b border-slate-100 px-5 py-3 bg-slate-50/60">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Provider Status</span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusBadge.bg}`}
          >
            <StatusIcon className="h-3 w-3" />
            {statusBadge.text}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* MAIN Group */}
        <div>
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            MAIN
          </p>
          <div className="space-y-1">
            {mainNavigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-konkan-50 text-konkan-700 font-semibold shadow-xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                          isActive ? "text-konkan-600" : "text-slate-400 group-hover:text-slate-600"
                        }`}
                        strokeWidth={1.9}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* ACCOUNT Group */}
        <div>
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            ACCOUNT
          </p>
          <div className="space-y-1">
            {accountNavigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-konkan-50 text-konkan-700 font-semibold shadow-xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                          isActive ? "text-konkan-600" : "text-slate-400 group-hover:text-slate-600"
                        }`}
                        strokeWidth={1.9}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom Profile Summary Card */}
      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-konkan-600 text-sm font-bold text-white">
            {vendor?.first_name ? vendor.first_name.charAt(0) : "P"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {vendor?.business_name || vendor?.public_display_name || "Activity Provider"}
            </p>
            <p className="text-[11px] text-slate-500 truncate">{vendor?.email || "provider@konkantrip.in"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default ActivityProviderSidebar;

