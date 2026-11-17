import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Compass,
  Building,
  User,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowRight,
  Info,
  Phone,
  Mail,
  FileCheck,
} from "lucide-react";
import Button from "../../../components/ui/Button/Button.jsx";
import Input from "../../../components/ui/Input/Input.jsx";
import { activityAuthApi } from "../api/activityAuth.api.js";
import { ACTIVITY_PROVIDER_ROUTES } from "../../../constants/routes.js";

export function ActivityRegisterPage() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState("Business"); // Individual | Business
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      password: "",
      business_name: "",
      legal_business_name: "",
      business_type: "Private Limited",
      gstin: "",
      business_registration_number: "",
      public_display_name: "",
      bio: "",
      years_of_experience: 5,
      languages_spoken: "Marathi, Hindi, English",
      contact_phone: "",
      contact_email: "",
      insurance_details: "",
      licence_details: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError("");
    try {
      const languages = data.languages_spoken
        ? data.languages_spoken.split(",").map((s) => s.trim())
        : ["English"];

      await activityAuthApi.register({
        ...data,
        account_type: accountType,
        languages_spoken: languages,
      });

      // Send initial OTPs
      await activityAuthApi.sendMobileOtp(data.phone);
      await activityAuthApi.sendEmailOtp(data.email);

      navigate(ACTIVITY_PROVIDER_ROUTES.VERIFY_OTP, {
        state: { phone: data.phone, email: data.email },
      });
    } catch (err) {
      setServerError(err?.message || "Registration failed. Please check the form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
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

        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Register as an Activity Provider
          </h2>
          <p className="mt-1 text-sm text-slate-500 leading-relaxed">
            Offer water sports, scuba diving, boat cruises, treks, and cultural experiences to thousands of Konkan travelers.
          </p>
        </div>

        {serverError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Account Type Selector */}
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-3">
              Account Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAccountType("Business")}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  accountType === "Business"
                    ? "border-konkan-600 bg-konkan-50/60 ring-2 ring-konkan-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    accountType === "Business" ? "bg-konkan-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Business / Company</p>
                  <p className="text-xs text-slate-500">Registered agency, operator, or firm</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAccountType("Individual")}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  accountType === "Individual"
                    ? "border-konkan-600 bg-konkan-50/60 ring-2 ring-konkan-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    accountType === "Individual" ? "bg-konkan-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Individual Operator</p>
                  <p className="text-xs text-slate-500">Solo guide, certified diver, boatman</p>
                </div>
              </button>
            </div>
          </div>

          {/* Section 1: Personal Details */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              1. Personal Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                required
                id="first_name"
                placeholder="e.g. Ramesh"
                error={errors.first_name?.message}
                {...register("first_name", { required: "First name is required" })}
              />
              <Input
                label="Last Name"
                required
                id="last_name"
                placeholder="e.g. Patil"
                error={errors.last_name?.message}
                {...register("last_name", { required: "Last name is required" })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number (Mobile)"
                required
                id="phone"
                type="tel"
                placeholder="e.g. +91 98221 45678"
                error={errors.phone?.message}
                {...register("phone", { required: "Phone number is required for OTP" })}
              />
              <Input
                label="Email Address"
                required
                id="email"
                type="email"
                placeholder="e.g. ramesh@konkanadventures.com"
                error={errors.email?.message}
                {...register("email", { required: "Email address is required for OTP" })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Create Password"
                required
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
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
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Must be at least 6 characters" },
                })}
              />
              <Input
                label="Public Display Name"
                id="public_display_name"
                placeholder="Brand or operator name visible to tourists"
                {...register("public_display_name")}
              />
            </div>
          </div>

          {/* Section 2: Business Details */}
          {accountType === "Business" && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                2. Business Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Business Name"
                  required
                  id="business_name"
                  placeholder="e.g. Konkan Ocean Adventures Pvt Ltd"
                  error={errors.business_name?.message}
                  {...register("business_name", { required: "Business name is required" })}
                />
                <Input
                  label="Legal Business Name"
                  id="legal_business_name"
                  placeholder="As registered in company documents"
                  {...register("legal_business_name")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Business Type</label>
                  <select
                    className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-konkan-500 focus:ring-2 focus:ring-konkan-100"
                    {...register("business_type")}
                  >
                    <option value="Private Limited">Private Limited</option>
                    <option value="Partnership">Partnership</option>
                    <option value="LLP">LLP</option>
                    <option value="Proprietorship">Proprietorship</option>
                    <option value="Cooperative Society">Cooperative Society</option>
                  </select>
                </div>
                <Input
                  label="GSTIN (Optional)"
                  id="gstin"
                  placeholder="e.g. 27AABCK1234F1Z8"
                  {...register("gstin")}
                />
                <Input
                  label="Registration / CIN Number"
                  id="business_registration_number"
                  placeholder="e.g. U63040MH2021PTC355890"
                  {...register("business_registration_number")}
                />
              </div>
            </div>
          )}

          {/* Section 3: Profile, Experience & Safety Compliance */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              {accountType === "Business" ? "3." : "2."} Profile & Safety Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Years of Experience"
                type="number"
                id="years_of_experience"
                placeholder="e.g. 8"
                {...register("years_of_experience")}
              />
              <Input
                label="Languages Spoken"
                id="languages_spoken"
                placeholder="e.g. Marathi, Hindi, English"
                {...register("languages_spoken")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Maritime / Tourism Licence Details"
                id="licence_details"
                placeholder="e.g. MMB Water Sports Licence #MMB-SD-2022-094"
                {...register("licence_details")}
              />
              <Input
                label="Insurance Policy Details"
                id="insurance_details"
                placeholder="e.g. Marine & Adventure Policy #981244093"
                {...register("insurance_details")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Emergency Contact Name"
                id="emergency_contact_name"
                placeholder="Name of emergency coordinator"
                {...register("emergency_contact_name")}
              />
              <Input
                label="Emergency Contact Phone"
                id="emergency_contact_phone"
                placeholder="+91 98765 43210"
                {...register("emergency_contact_phone")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Bio / Operator Summary</label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-konkan-500 focus:ring-2 focus:ring-konkan-100"
                placeholder="Briefly describe your activities, equipment quality, safety certifications, and service history..."
                {...register("bio")}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-4 text-xs text-amber-800 flex items-start gap-3">
            <Info className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">Verification Requirement</p>
              <p className="mt-0.5">
                Both Mobile Number and Email Address OTP verification are required immediately after registration. Following verification, our compliance team reviews your certifications before you can publish live slots.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Already registered?{" "}
              <Link to={ACTIVITY_PROVIDER_ROUTES.LOGIN} className="font-semibold text-konkan-700 hover:underline">
                Sign in to Provider Portal
              </Link>
            </p>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full sm:w-auto min-w-[200px]"
            >
              {isSubmitting ? "Creating Account..." : "Continue to OTP Verification"}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ActivityRegisterPage;

