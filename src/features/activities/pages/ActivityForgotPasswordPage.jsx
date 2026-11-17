import { useState } from "react";
import { Link } from "react-router-dom";
import { Compass, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Button from "../../../components/ui/Button/Button.jsx";
import Input from "../../../components/ui/Input/Input.jsx";
import { activityAuthApi } from "../api/activityAuth.api.js";
import { ACTIVITY_PROVIDER_ROUTES } from "../../../constants/routes.js";

export function ActivityForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await activityAuthApi.forgotPassword(email);
      setSubmitted(true);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-konkan-700 to-teal-500 text-white shadow-sm">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-konkan-800 leading-tight">
              KonkanTrip<span className="text-xs align-top font-semibold text-konkan-600">™</span>
            </h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-konkan-600">
              Provider Password Reset
            </p>
          </div>
        </div>

        {!submitted ? (
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Reset Password</h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter your registered provider email and we'll send you instructions to set a new password.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input
                label="Registered Email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="provider@example.com"
              />

              <Button type="submit" size="lg" fullWidth disabled={loading}>
                {loading ? "Sending link..." : "Send Reset Link"}
              </Button>
            </form>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Reset Link Sent</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              If an account exists for <span className="font-semibold text-slate-800">{email}</span>, you will receive password reset instructions within 2 minutes.
            </p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link
            to={ACTIVITY_PROVIDER_ROUTES.LOGIN}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-konkan-700 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Provider Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ActivityForgotPasswordPage;

