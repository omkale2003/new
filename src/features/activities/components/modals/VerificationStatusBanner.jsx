import { AlertTriangle, Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import useActivityAuth from "../../hooks/useActivityAuth.js";
import { ACTIVITY_PROVIDER_ROUTES } from "../../../../constants/routes.js";

export function VerificationStatusBanner() {
  const { status, vendor, canPublish } = useActivityAuth();

  if (canPublish) {
    return null; // All good, account is Active
  }

  const getBannerDetails = () => {
    switch (status) {
      case "Pending Verification":
        return {
          icon: AlertTriangle,
          bg: "bg-blue-50 border-blue-200 text-blue-900",
          iconColor: "text-blue-600",
          title: "Account Verification Pending",
          desc: "Please complete both Mobile and Email OTP verifications to submit your profile for admin approval.",
          actionText: "Verify Now",
          actionLink: ACTIVITY_PROVIDER_ROUTES.VERIFY_OTP,
        };
      case "Pending Review":
        return {
          icon: Clock,
          bg: "bg-amber-50 border-amber-200 text-amber-900",
          iconColor: "text-amber-600",
          title: "Account Under Administrative Review",
          desc: "Your business credentials and licences are being verified by the KonkanTrip compliance team. You can draft activities, but publishing requires active status.",
          actionText: "Check Review Status",
          actionLink: ACTIVITY_PROVIDER_ROUTES.VERIFICATION_STATUS,
        };
      case "Rejected":
        return {
          icon: XCircle,
          bg: "bg-red-50 border-red-200 text-red-900",
          iconColor: "text-red-600",
          title: "Application Needs Attention",
          desc: "Your vendor verification was not approved. Please update your registration documents or contact our vendor desk.",
          actionText: "View Feedback",
          actionLink: ACTIVITY_PROVIDER_ROUTES.VERIFICATION_STATUS,
        };
      default:
        return {
          icon: AlertTriangle,
          bg: "bg-slate-50 border-slate-200 text-slate-800",
          iconColor: "text-slate-500",
          title: `Account Status: ${status}`,
          desc: "Publishing is disabled until your activity provider account is active.",
          actionText: "Details",
          actionLink: ACTIVITY_PROVIDER_ROUTES.VERIFICATION_STATUS,
        };
    }
  };

  const details = getBannerDetails();
  const Icon = details.icon;

  return (
    <div className={`mb-6 rounded-2xl border p-4.5 sm:p-5 shadow-xs ${details.bg}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-1 rounded-lg">
            <Icon className={`h-5 w-5 shrink-0 ${details.iconColor}`} />
          </div>
          <div>
            <h4 className="text-sm font-semibold">{details.title}</h4>
            <p className="mt-0.5 text-xs opacity-90 leading-relaxed max-w-2xl">
              {details.desc}
            </p>
          </div>
        </div>

        <Link
          to={details.actionLink}
          className="inline-flex items-center gap-1.5 self-start sm:self-center shrink-0 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold shadow-xs hover:bg-slate-50 transition border border-current/20"
        >
          <span>{details.actionText}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default VerificationStatusBanner;
