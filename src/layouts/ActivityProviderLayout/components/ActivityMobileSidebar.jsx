import { useEffect } from "react";
import { NavLink } from "react-router-dom";
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
  X,
  ShieldCheck,
} from "lucide-react";
import useActivityAuth from "../../../features/activities/hooks/useActivityAuth.js";
import { ACTIVITY_PROVIDER_ROUTES } from "../../../constants/routes.js";

const navItems = [
  { label: "Dashboard", path: ACTIVITY_PROVIDER_ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "My Activities", path: ACTIVITY_PROVIDER_ROUTES.ACTIVITIES, icon: Sparkles },
  { label: "Add Activity", path: ACTIVITY_PROVIDER_ROUTES.ADD_ACTIVITY, icon: PlusCircle },
  { label: "Availability & Slots", path: ACTIVITY_PROVIDER_ROUTES.AVAILABILITY, icon: CalendarClock },
  { label: "Pricing & Rates", path: ACTIVITY_PROVIDER_ROUTES.PRICING, icon: CircleDollarSign },
  { label: "Media Gallery", path: ACTIVITY_PROVIDER_ROUTES.MEDIA, icon: ImageIcon },
  { label: "Bookings", path: ACTIVITY_PROVIDER_ROUTES.BOOKINGS, icon: Ticket },
  { label: "Participants", path: ACTIVITY_PROVIDER_ROUTES.PARTICIPANTS, icon: Users2 },
  { label: "Business Profile", path: ACTIVITY_PROVIDER_ROUTES.PROFILE, icon: Building },
  { label: "Settings", path: ACTIVITY_PROVIDER_ROUTES.SETTINGS, icon: Settings },
];

export function ActivityMobileSidebar({ isOpen, onClose }) {
  const { vendor, status } = useActivityAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-white shadow-2xl animate-slideInRight">
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-konkan-600 text-white shadow-xs">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 leading-tight">KonkanTrip™</p>
              <p className="text-[11px] text-slate-500">Activities Portal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-konkan-50 text-konkan-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-konkan-600 text-xs font-bold text-white">
              {vendor?.first_name ? vendor.first_name.charAt(0) : "P"}
            </div>
            <div className="min-w-0 flex-1 text-xs">
              <p className="font-semibold text-slate-900 truncate">
                {vendor?.business_name || vendor?.first_name || "Provider"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">Status: {status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityMobileSidebar;

