import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Compass,
  ShieldCheck,
  Clock,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  FileCheck,
  Building,
  ArrowRight,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import Button from "../../../components/ui/Button/Button.jsx";
import useActivityAuth from "../hooks/useActivityAuth.js";
import activityStorageService from "../services/activityStorage.service.js";
import { ACTIVITY_PROVIDER_ROUTES } from "../../../constants/routes.js";

const STATUS_CONFIGS = {
  "Pending Verification": {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    icon: AlertTriangle,
    title: "OTP Verification Incomplete",
    description:
      "You have initiated registration, but both your mobile number and email address must be verified before administrative compliance review can proceed.",
    canPublish: false,
    nextStep: "Verify your Mobile and Email with one-time verification codes.",
    actionText: "Verify Mobile & Email",
    actionRoute: ACTIVITY_PROVIDER_ROUTES.VERIFY_OTP,
  },
  "Pending Review": {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
    title: "Administrative Review in Progress",
    description:
      "Your registration documents, water sports certifications, and insurance policies are currently being reviewed by the KonkanTrip Operations Team.",
    canPublish: false,
    nextStep: "Average review time is 24-48 business hours. You may draft activities while you wait.",
    actionText: "Go to Dashboard",
    actionRoute: ACTIVITY_PROVIDER_ROUTES.DASHBOARD,
  },
  Active: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: ShieldCheck,
    title: "Account Active & Verified",
    description:
      "Your activity provider account is fully certified and verified. You have full privileges to publish live activities, manage slot capacities, and accept guest bookings.",
    canPublish: true,
    nextStep: "Create new activities and publish slots to start receiving tourist bookings.",
    actionText: "Manage Activities",
    actionRoute: ACTIVITY_PROVIDER_ROUTES.ACTIVITIES,
  },
  Rejected: {
    badge: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
    title: "Verification Application Rejected",
    description:
      "Our compliance officers were unable to verify your maritime licence or safety insurance details.",
    canPublish: false,
    nextStep: "Please update your business licence details in your profile and request a re-review.",
    actionText: "Update Profile & Licences",
    actionRoute: ACTIVITY_PROVIDER_ROUTES.PROFILE,
  },
  Suspended: {
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    icon: AlertTriangle,
    title: "Account Temporarily Suspended",
    description:
      "Your provider privileges have been paused due to unresolved safety complaints or expired maritime safety permits.",
    canPublish: false,
    nextStep: "Contact compliance@konkantrip.in or reach out to your regional coordinator.",
    actionText: "Contact Support",
    actionRoute: ACTIVITY_PROVIDER_ROUTES.SETTINGS,
  },
  Inactive: {
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Clock,
    title: "Account Inactive (Seasonal / Paused)",
    description:
      "Your provider account is currently placed on seasonal pause (e.g., monsoon sea closure period).",
    canPublish: false,
    nextStep: "Reactivate your account once your operating season commences.",
    actionText: "Account Settings",
    actionRoute: ACTIVITY_PROVIDER_ROUTES.SETTINGS,
  },
};

export function ActivityVerificationStatusPage() {
  const navigate = useNavigate();
  const { vendor, status: currentStatus, refreshUser } = useActivityAuth();

  const [activeStatus, setActiveStatus] = useState(currentStatus || "Pending Review");
  const config = STATUS_CONFIGS[activeStatus] || STATUS_CONFIGS["Pending Review"];
  const StatusIcon = config.icon;

  // Demo simulator helper to test different statuses
  const handleSimulateStatus = (newStatus) => {
    setActiveStatus(newStatus);
    const user = activityStorageService.getUser() || {};
    user.status = newStatus;
    activityStorageService.setUser(user);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Provider Verification Status
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Vendor ID: <span className="font-mono font-medium text-slate-700">{vendor?.vendor_id || "vnd_001"}</span>
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-1.5 text-xs font-bold ${config.badge}`}
          >
            <StatusIcon className="h-4 w-4" />
            {activeStatus}
          </span>
        </div>

        {/* Status Body */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
              <h3 className="text-base font-bold text-slate-900">{config.title}</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">{config.description}</p>

              <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-start gap-2.5">
                <FileCheck className="h-4 w-4 text-konkan-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-900">Next Action Required:</p>
                  <p className="text-xs text-slate-600">{config.nextStep}</p>
                </div>
              </div>
            </div>

            {/* Publishing Restriction Alert */}
            <div
              className={`rounded-2xl border p-4.5 text-xs ${
                config.canPublish
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-amber-50 border-amber-200 text-amber-800"
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                {config.canPublish ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                )}
                <span>
                  {config.canPublish
                    ? "Activity Publishing Enabled"
                    : "Activity Publishing Restricted"}
                </span>
              </div>
              <p className="leading-relaxed">
                {config.canPublish
                  ? "Your activities can be directly published to live tourist catalog searches with online booking."
                  : "You can create drafts and set up rates, but you will not be able to submit activities for public listing until status is Active."}
              </p>
            </div>

            <div className="pt-2">
              <Link
                to={config.actionRoute}
                className="inline-flex items-center gap-2 rounded-xl bg-konkan-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-konkan-700 transition"
              >
                <span>{config.actionText}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Verification Stages Progress */}
          <div className="rounded-2xl border border-slate-200 p-5 bg-white space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verification Pipeline
            </h4>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-slate-900">1. Account Registration</p>
                  <p className="text-[11px] text-slate-500">Business & personal profile submitted</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full shrink-0 mt-0.5 ${
                    vendor?.mobile_verified ? "bg-emerald-600 text-white" : "bg-blue-600 text-white"
                  }`}
                >
                  {vendor?.mobile_verified ? "✓" : "2"}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">2. Mobile OTP Verification</p>
                  <p className="text-[11px] text-slate-500">
                    {vendor?.mobile_verified ? "Completed" : "Pending SMS code"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full shrink-0 mt-0.5 ${
                    vendor?.email_verified ? "bg-emerald-600 text-white" : "bg-blue-600 text-white"
                  }`}
                >
                  {vendor?.email_verified ? "✓" : "3"}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">3. Email OTP Verification</p>
                  <p className="text-[11px] text-slate-500">
                    {vendor?.email_verified ? "Completed" : "Pending Email code"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full shrink-0 mt-0.5 ${
                    activeStatus === "Active"
                      ? "bg-emerald-600 text-white"
                      : activeStatus === "Pending Review"
                      ? "bg-amber-500 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {activeStatus === "Active" ? "✓" : "4"}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">4. Admin Document Review</p>
                  <p className="text-[11px] text-slate-500">
                    Licence, insurance & marine safety review
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full shrink-0 mt-0.5 ${
                    activeStatus === "Active" ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  5
                </div>
                <div>
                  <p className="font-semibold text-slate-900">5. Active Provider</p>
                  <p className="text-[11px] text-slate-500">Authorized to publish activities</p>
                </div>
              </div>
            </div>

            {/* Test Simulator Toggle Box */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Simulate Status (For Testing)
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.keys(STATUS_CONFIGS).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleSimulateStatus(st)}
                    className={`rounded-lg px-2 py-1 text-[11px] font-medium transition text-left ${
                      activeStatus === st
                        ? "bg-konkan-700 text-white font-bold"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityVerificationStatusPage;

