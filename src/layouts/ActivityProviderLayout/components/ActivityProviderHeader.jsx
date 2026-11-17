import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCheck,
  ChevronDown,
  Info,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  User,
  Plus,
  Compass,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useActivityAuth from "../../../features/activities/hooks/useActivityAuth.js";
import { ACTIVITY_PROVIDER_ROUTES } from "../../../constants/routes.js";

const DEFAULT_ACTIVITY_NOTIFICATIONS = [
  {
    id: 1,
    title: "New Booking Received",
    message: "Aditya Deshmukh booked Scuba Diving for 3 guests on Nov 15.",
    time: "15 mins ago",
    unread: true,
    type: "info",
  },
  {
    id: 2,
    title: "Activity Reviewed",
    message: "Malvan Scuba Diving received a 5-star customer feedback rating.",
    time: "3 hours ago",
    unread: true,
    type: "success",
  },
  {
    id: 3,
    title: "Slot Availability Reminder",
    message: "Only 2 slots remaining for Sunset Kayaking on Nov 15.",
    time: "1 day ago",
    unread: false,
    type: "alert",
  },
];

export function ActivityProviderHeader({ onMenuClick }) {
  const navigate = useNavigate();
  const { vendor, logout, status } = useActivityAuth();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(DEFAULT_ACTIVITY_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState("");

  const notifDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const displayName = vendor?.business_name || vendor?.public_display_name || vendor?.first_name || "Provider";

  return (
    <header className="sticky top-0 z-20 shrink-0 flex h-18 items-center justify-between border-b border-slate-100 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Mobile Menu Trigger & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search */}
        <div className="relative flex items-center w-full max-w-sm sm:max-w-md">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities, slots, bookings..."
            className="w-full rounded-xl border border-slate-200/80 bg-slate-50/60 py-2 pl-10 pr-14 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-konkan-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-konkan-500 transition-all"
          />
          <div className="absolute right-3 flex items-center pointer-events-none">
            <kbd className="flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 shadow-2xs">
              ⌘ K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Add Button */}
        <Link
          to={ACTIVITY_PROVIDER_ROUTES.ADD_ACTIVITY}
          className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-konkan-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-konkan-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>New Activity</span>
        </Link>

        {/* Notification Dropdown */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            type="button"
            onClick={() => {
              setIsNotifOpen((prev) => !prev);
              setIsProfileOpen(false);
            }}
            className={[
              "relative rounded-xl p-2.5 transition-colors",
              isNotifOpen ? "bg-konkan-50 text-konkan-700" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
            ].join(" ")}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-konkan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-konkan-600" />
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-100 bg-white shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-konkan-100 px-2 py-0.5 text-[11px] font-bold text-konkan-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-xs font-medium text-konkan-600 hover:text-konkan-700"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-4 transition hover:bg-slate-50 ${n.unread ? "bg-konkan-50/30" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            type="button"
            onClick={() => {
              setIsProfileOpen((prev) => !prev);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-50 transition"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-konkan-700 text-xs font-bold text-white shadow-xs">
              {displayName.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight max-w-[130px] truncate">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">Activity Provider</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-100 bg-white shadow-xl z-50 p-2">
              <div className="border-b border-slate-100 px-3 py-2.5 mb-1">
                <p className="text-xs font-semibold text-slate-900 truncate">{displayName}</p>
                <p className="text-[11px] text-slate-500 truncate">{vendor?.email}</p>
                <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-konkan-50 px-2 py-0.5 text-[10px] font-semibold text-konkan-700">
                  <ShieldCheck className="h-3 w-3" /> Status: {status}
                </span>
              </div>

              <Link
                to={ACTIVITY_PROVIDER_ROUTES.PROFILE}
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <User className="h-4 w-4 text-slate-400" />
                Business Profile
              </Link>
              <Link
                to={ACTIVITY_PROVIDER_ROUTES.VERIFICATION_STATUS}
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <Info className="h-4 w-4 text-slate-400" />
                Verification Status
              </Link>
              <Link
                to={ACTIVITY_PROVIDER_ROUTES.SETTINGS}
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <Compass className="h-4 w-4 text-slate-400" />
                Account Settings
              </Link>

              <div className="border-t border-slate-100 my-1 pt-1">
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default ActivityProviderHeader;

