import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Building,
  User,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Phone,
  Mail,
  Save,
  AlertTriangle,
} from "lucide-react";
import Button from "../../../components/ui/Button/Button.jsx";
import Input from "../../../components/ui/Input/Input.jsx";
import useActivityAuth from "../hooks/useActivityAuth.js";
import { activityAuthApi } from "../api/activityAuth.api.js";

export function ActivityProfilePage() {
  const { vendor, status, refreshUser } = useActivityAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: vendor?.first_name || "Ramesh",
      last_name: vendor?.last_name || "Patil",
      phone: vendor?.phone || "+91 98221 45678",
      email: vendor?.email || "ramesh.patil@konkanwatersports.in",
      business_name: vendor?.business_name || "Konkan Ocean Adventures Pvt Ltd",
      legal_business_name: vendor?.legal_business_name || "Konkan Ocean Adventures Private Limited",
      business_type: vendor?.business_type || "Private Limited",
      gstin: vendor?.gstin || "27AABCK1234F1Z8",
      business_registration_number: vendor?.business_registration_number || "U63040MH2021PTC355890",
      public_display_name: vendor?.public_display_name || "Konkan Ocean Adventures",
      bio: vendor?.bio || "Leading certified scuba diving, water sports, and marine expedition operator.",
      years_of_experience: vendor?.years_of_experience || 9,
      languages_spoken: Array.isArray(vendor?.languages_spoken)
        ? vendor.languages_spoken.join(", ")
        : "Marathi, Hindi, English",
      contact_phone: vendor?.contact_phone || "+91 98221 45678",
      contact_email: vendor?.contact_email || "support@konkanwatersports.in",
      insurance_details:
        vendor?.insurance_details ||
        "National Insurance Co. Ltd - Marine & Adventure Policy #981244093, ₹50 Lakhs Coverage",
      licence_details:
        vendor?.licence_details ||
        "Maharashtra Maritime Board Water Sports Licence #MMB-SD-2022-094",
      emergency_contact_name: vendor?.emergency_contact_name || "Suresh Tendulkar",
      emergency_contact_phone: vendor?.emergency_contact_phone || "+91 98765 43210",
    },
  });

  const onSubmit = async (formData) => {
    setIsSaving(true);
    setSuccessMsg("");
    try {
      const languages = formData.languages_spoken
        ? formData.languages_spoken.split(",").map((s) => s.trim())
        : ["English"];

      await activityAuthApi.updateProfile({
        ...formData,
        languages_spoken: languages,
      });

      await refreshUser();
      setSuccessMsg("Business profile details updated successfully.");
    } catch (err) {
      alert(err?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Business Profile & Verification
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Legal entity details, maritime permits, adventure safety insurance, and public listings.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-800">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Status: {status}
        </span>
      </div>

      {successMsg && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Card 1: Legal Business Entity */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            1. Legal Entity & Registration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Business Trade Name"
              required
              id="business_name"
              {...register("business_name", { required: "Business name required" })}
            />
            <Input
              label="Legal Corporate Name"
              id="legal_business_name"
              {...register("legal_business_name")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Business Structure</label>
              <select
                className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-konkan-500"
                {...register("business_type")}
              >
                <option value="Private Limited">Private Limited</option>
                <option value="Partnership">Partnership</option>
                <option value="LLP">LLP</option>
                <option value="Proprietorship">Proprietorship</option>
              </select>
            </div>
            <Input label="GSTIN" id="gstin" {...register("gstin")} />
            <Input
              label="Registration / CIN"
              id="business_registration_number"
              {...register("business_registration_number")}
            />
          </div>
        </div>

        {/* Card 2: Personal & Contact Details */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            2. Primary Contact & Authorized Representative
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              required
              id="first_name"
              {...register("first_name", { required: "First name is required" })}
            />
            <Input
              label="Last Name"
              required
              id="last_name"
              {...register("last_name", { required: "Last name is required" })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Operational Contact Phone"
              required
              type="tel"
              id="contact_phone"
              {...register("contact_phone")}
            />
            <Input
              label="Official Contact Email"
              required
              type="email"
              id="contact_email"
              {...register("contact_email")}
            />
          </div>
        </div>

        {/* Card 3: Experience, Licencing & Insurance */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            3. Marine Safety Compliance & Licencing
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Maritime Board Licence Number"
              id="licence_details"
              {...register("licence_details")}
            />
            <Input
              label="Commercial Adventure Insurance"
              id="insurance_details"
              {...register("insurance_details")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Emergency Contact Name"
              id="emergency_contact_name"
              {...register("emergency_contact_name")}
            />
            <Input
              label="Emergency Contact 24/7 Phone"
              id="emergency_contact_phone"
              {...register("emergency_contact_phone")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Years of Experience"
              type="number"
              id="years_of_experience"
              {...register("years_of_experience")}
            />
            <Input
              label="Languages Spoken"
              id="languages_spoken"
              {...register("languages_spoken")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Company Bio / Narrative</label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-konkan-500"
              {...register("bio")}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" size="lg" disabled={isSaving}>
            <Save className="h-4 w-4 mr-1" />
            {isSaving ? "Saving..." : "Save Profile Details"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ActivityProfilePage;

