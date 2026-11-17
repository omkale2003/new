import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Compass,
  Eye,
  EyeOff,
  ShieldCheck,
  Smartphone,
  KeyRound,
  ArrowRight,
  Info,
} from "lucide-react";
import Button from "../../../components/ui/Button/Button.jsx";
import Input from "../../../components/ui/Input/Input.jsx";
import { activityAuthApi } from "../api/activityAuth.api.js";
import { ACTIVITY_PROVIDER_ROUTES } from "../../../constants/routes.js";

export function ActivityLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loginMethod, setLoginMethod] = useState("password"); // "password" | "otp"
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInfo, setOtpInfo] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "ramesh.patil@konkanwatersports.in",
      password: "password123",
      otp: "",
      remember_me: true,
    },
  });

  const emailValue = watch("email");

  const handleRequestOtp = async () => {
    if (!emailValue) {
      setServerError("Please enter your registered email address first.");
      return;
    }
    setServerError("");
    try {
      await activityAuthApi.sendEmailOtp(emailValue);
      setOtpSent(true);
      setOtpInfo("Demo OTP code is 123456");
    } catch {
      setServerError("Failed to send OTP code.");
    }
  };

  const onSubmit = async (formData) => {
    setServerError("");
    setIsSubmitting(true);
    try {
      await activityAuthApi.login({
        email: formData.email,
        password: formData.password,
        login_method: loginMethod,
        otp: formData.otp,
      });

      const redirectPath = location.state?.from?.pathname || ACTIVITY_PROVIDER_ROUTES.DASHBOARD;
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setServerError(err?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-konkan-700 to-teal-500 text-white shadow-sm">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-konkan-800 leading-tight">
              KonkanTrip<span className="text-xs align-top font-semibold text-konkan-600">™</span>
            </h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-konkan-600">
              Activities Provider Portal
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Provider Sign In</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your activities, time slots, guest manifests, and booking payouts.
          </p>
        </div>

        {/* Login Method Toggle */}
        <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setLoginMethod("password")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
              loginMethod === "password"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod("otp")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
              loginMethod === "otp"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            OTP Login
          </button>
        </div>

        {serverError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700">
            {serverError}
          </div>
        )}

        {otpInfo && (
          <div className="mb-5 rounded-xl border border-konkan-200 bg-konkan-50 p-3 text-xs font-medium text-konkan-800">
            {otpInfo}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            required
            id="email"
            type="email"
            placeholder="provider@example.com"
            error={errors.email?.message}
            {...register("email", { required: "Email is required" })}
          />

          {loginMethod === "password" ? (
            <div>
              <Input
                label="Password"
                required
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                error={errors.password?.message}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                {...register("password", { required: "Password is required" })}
              />

              <div className="mt-2 text-right">
                <Link
                  to={ACTIVITY_PROVIDER_ROUTES.FORGOT_PASSWORD}
                  className="text-xs font-semibold text-konkan-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    label="Enter One-Time Password"
                    required
                    id="otp"
                    placeholder="Enter 123456"
                    error={errors.otp?.message}
                    {...register("otp", { required: "OTP code is required" })}
                  />
                </div>
                <div className="pt-7">
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    className="h-11 px-3 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                  >
                    {otpSent ? "Resend" : "Send OTP"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-konkan-600 focus:ring-konkan-500"
                {...register("remember_me")}
              />
              <span>Remember this device for 30 days</span>
            </label>
          </div>

          <Button type="submit" size="lg" fullWidth disabled={isSubmitting} className="mt-4">
            {isSubmitting ? "Authenticating..." : "Sign In to Provider Portal"}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            New activity vendor?{" "}
            <Link
              to={ACTIVITY_PROVIDER_ROUTES.REGISTER}
              className="font-bold text-konkan-700 hover:underline"
            >
              Register your business here
            </Link>
          </p>

          <p className="mt-3 text-[11px] text-slate-400">
            Property owners can access the{" "}
            <Link to="/login" className="underline hover:text-slate-600">
              Property Owner Portal
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default ActivityLoginPage;

