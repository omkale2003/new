import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Compass,
  Smartphone,
  Mail,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Button from "../../../components/ui/Button/Button.jsx";
import Input from "../../../components/ui/Input/Input.jsx";
import { activityAuthApi } from "../api/activityAuth.api.js";
import activityStorageService from "../services/activityStorage.service.js";
import { ACTIVITY_PROVIDER_ROUTES } from "../../../constants/routes.js";

export function ActivityVerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = activityStorageService.getUser();
  const phone = location.state?.phone || user?.phone || "+91 98221 45678";
  const email = location.state?.email || user?.email || "provider@konkanwatersports.in";

  const [verificationState, setVerificationState] = useState(() =>
    activityStorageService.getVerificationState()
  );

  const [mobileOtp, setMobileOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");

  const [mobileError, setMobileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileSuccess, setMobileSuccess] = useState(verificationState.mobileVerified);
  const [emailSuccess, setEmailSuccess] = useState(verificationState.emailVerified);

  const [isVerifyingMobile, setIsVerifyingMobile] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [resendStatus, setResendStatus] = useState("");

  const allVerified = mobileSuccess && emailSuccess;

  const handleVerifyMobile = async (e) => {
    e.preventDefault();
    setMobileError("");
    setIsVerifyingMobile(true);
    try {
      const res = await activityAuthApi.verifyMobileOtp(phone, mobileOtp);
      setMobileSuccess(true);
      setVerificationState(res.verificationState);
    } catch (err) {
      setMobileError(err?.message || "Invalid mobile OTP.");
    } finally {
      setIsVerifyingMobile(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setEmailError("");
    setIsVerifyingEmail(true);
    try {
      const res = await activityAuthApi.verifyEmailOtp(email, emailOtp);
      setEmailSuccess(true);
      setVerificationState(res.verificationState);
    } catch (err) {
      setEmailError(err?.message || "Invalid email OTP.");
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleResend = async (type) => {
    setResendStatus("");
    try {
      if (type === "mobile") {
        await activityAuthApi.sendMobileOtp(phone);
        setResendStatus("New OTP sent to mobile (Demo: 123456)");
      } else {
        await activityAuthApi.sendEmailOtp(email);
        setResendStatus("New OTP sent to email (Demo: 654321)");
      }
    } catch {
      setResendStatus("Failed to resend code.");
    }
  };

  const handleComplete = () => {
    navigate(ACTIVITY_PROVIDER_ROUTES.VERIFICATION_STATUS);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-konkan-700 to-teal-500 text-white shadow-sm">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-konkan-800 leading-tight">
              KonkanTrip<span className="text-xs align-top font-semibold text-konkan-600">™</span>
            </h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-konkan-600">
              Provider Identity Verification
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Verify Mobile & Email
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            For tourist safety and regulatory maritime compliance, both contact channels must be authenticated.
          </p>
        </div>

        {resendStatus && (
          <div className="mb-6 rounded-xl border border-konkan-200 bg-konkan-50 p-3 text-xs font-medium text-konkan-800">
            {resendStatus}
          </div>
        )}

        <div className="space-y-6">
          {/* Card 1: Mobile OTP */}
          <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    mobileSuccess ? "bg-emerald-100 text-emerald-700" : "bg-konkan-100 text-konkan-700"
                  }`}
                >
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Mobile Number Verification</h3>
                  <p className="text-xs text-slate-500">Sent to {phone}</p>
                </div>
              </div>

              {mobileSuccess ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                  Pending OTP
                </span>
              )}
            </div>

            {!mobileSuccess ? (
              <form onSubmit={handleVerifyMobile} className="mt-4 pt-4 border-t border-slate-200/80">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      maxLength={6}
                      value={mobileOtp}
                      onChange={(e) => setMobileOtp(e.target.value)}
                      placeholder="Enter 6-digit code (Use 123456)"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-konkan-500 focus:ring-2 focus:ring-konkan-100"
                    />
                    {mobileError && <p className="mt-1 text-xs text-red-600">{mobileError}</p>}
                  </div>
                  <Button type="submit" size="sm" disabled={isVerifyingMobile || mobileOtp.length < 4}>
                    {isVerifyingMobile ? "Verifying..." : "Verify Mobile"}
                  </Button>
                </div>
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleResend("mobile")}
                    className="text-[11px] font-semibold text-konkan-700 hover:underline"
                  >
                    Resend SMS Code
                  </button>
                </div>
              </form>
            ) : (
              <p className="mt-3 text-xs text-emerald-700 font-medium">
                ✓ Primary mobile number verified. Urgent trip dispatch alerts will be routed here.
              </p>
            )}
          </div>

          {/* Card 2: Email OTP */}
          <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    emailSuccess ? "bg-emerald-100 text-emerald-700" : "bg-konkan-100 text-konkan-700"
                  }`}
                >
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Email Address Verification</h3>
                  <p className="text-xs text-slate-500">Sent to {email}</p>
                </div>
              </div>

              {emailSuccess ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                  Pending OTP
                </span>
              )}
            </div>

            {!emailSuccess ? (
              <form onSubmit={handleVerifyEmail} className="mt-4 pt-4 border-t border-slate-200/80">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      maxLength={6}
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      placeholder="Enter 6-digit code (Use 654321)"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-konkan-500 focus:ring-2 focus:ring-konkan-100"
                    />
                    {emailError && <p className="mt-1 text-xs text-red-600">{emailError}</p>}
                  </div>
                  <Button type="submit" size="sm" disabled={isVerifyingEmail || emailOtp.length < 4}>
                    {isVerifyingEmail ? "Verifying..." : "Verify Email"}
                  </Button>
                </div>
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleResend("email")}
                    className="text-[11px] font-semibold text-konkan-700 hover:underline"
                  >
                    Resend Email Code
                  </button>
                </div>
              </form>
            ) : (
              <p className="mt-3 text-xs text-emerald-700 font-medium">
                ✓ Email address verified. Invoices and booking confirmation manifests will be sent here.
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to={ACTIVITY_PROVIDER_ROUTES.LOGIN}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            ← Back to Login
          </Link>

          <Button
            type="button"
            size="lg"
            onClick={handleComplete}
            disabled={!allVerified}
            className="w-full sm:w-auto min-w-[220px]"
          >
            {allVerified ? "Proceed to Account Status" : "Verify Both Channels to Continue"}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </main>
  );
}

export default ActivityVerifyOtpPage;

