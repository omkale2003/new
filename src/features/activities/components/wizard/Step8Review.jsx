import { useState } from "react";
import Button from "../../../../components/ui/Button/Button.jsx";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  Tag,
  CalendarDays,
  Image as ImageIcon,
  Save,
  Send,
} from "lucide-react";
import useActivityAuth from "../../hooks/useActivityAuth.js";

export function Step8Review({
  activityData,
  onPrev,
  onJumpToStep,
  onSaveDraft,
  onSubmitForReview,
  isSubmitting,
}) {
  const { status: providerStatus, canPublish } = useActivityAuth();
  const [submissionError, setSubmissionError] = useState("");

  const handleReviewSubmit = () => {
    setSubmissionError("");
    if (!canPublish) {
      setSubmissionError(
        `Cannot publish activity. Your provider account status is "${providerStatus}". Account must be "Active" before activities can be submitted for public review.`
      );
      return;
    }
    onSubmitForReview();
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Step 8 — Review & Final Submission</h3>
          <p className="text-xs text-slate-500">
            Carefully verify all details before saving as draft or publishing to the review queue.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          8 of 8 Steps Complete
        </span>
      </div>

      {submissionError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Publishing Restricted</p>
            <p className="mt-0.5 leading-relaxed">{submissionError}</p>
          </div>
        </div>
      )}

      {/* Hero Preview Card */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="relative aspect-video sm:aspect-21/9 w-full bg-slate-900">
          <img
            src={activityData.cover_image}
            alt={activityData.name}
            className="h-full w-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
            <span className="inline-block rounded-md bg-konkan-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider mb-2">
              {activityData.category_name}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold leading-tight">{activityData.name}</h2>
            <p className="mt-1 text-xs text-slate-200 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" /> {activityData.city}, {activityData.district} •{" "}
              <Clock className="h-3.5 w-3.5 ml-1" /> {activityData.duration_display || "2 Hours"}
            </p>
          </div>
        </div>

        {/* Section Review Blocks */}
        <div className="p-6 space-y-6 divide-y divide-slate-100">
          {/* Section 1: Basic Info */}
          <div className="pt-2 first:pt-0">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-konkan-600" /> Basic Details
              </h4>
              <button
                type="button"
                onClick={() => onJumpToStep(1)}
                className="text-xs font-semibold text-konkan-700 hover:underline flex items-center gap-1"
              >
                <Edit2 className="h-3 w-3" /> Edit
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{activityData.short_description}</p>
            <p className="mt-2 text-xs text-slate-500 line-clamp-3 leading-relaxed">
              {activityData.full_description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                Experience: <strong>{activityData.experience_type}</strong>
              </span>
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                Difficulty: <strong>{activityData.difficulty_level}</strong>
              </span>
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                Duration: <strong>{activityData.duration_minutes} mins</strong>
              </span>
            </div>
          </div>

          {/* Section 2: Participant Requirements */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-konkan-600" /> Participant Requirements
              </h4>
              <button
                type="button"
                onClick={() => onJumpToStep(2)}
                className="text-xs font-semibold text-konkan-700 hover:underline flex items-center gap-1"
              >
                <Edit2 className="h-3 w-3" /> Edit
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <span className="text-slate-400 block text-[11px]">Party Capacity</span>
                <span className="font-bold text-slate-900 text-sm">
                  {activityData.min_participants} - {activityData.max_participants} Guests
                </span>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <span className="text-slate-400 block text-[11px]">Permitted Age</span>
                <span className="font-bold text-slate-900 text-sm">
                  {activityData.min_age} to {activityData.max_age} Years
                </span>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <span className="text-slate-400 block text-[11px]">Weight Range</span>
                <span className="font-bold text-slate-900 text-sm">
                  {activityData.min_weight_kg || 25} - {activityData.max_weight_kg || 120} kg
                </span>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <span className="text-slate-400 block text-[11px]">Weather Rule</span>
                <span className="font-bold text-slate-900 text-sm">
                  {activityData.weather_dependent ? "Weather Dependent" : "All Weather"}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Meeting Location */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-konkan-600" /> Meeting Point & Reporting Location
              </h4>
              <button
                type="button"
                onClick={() => onJumpToStep(3)}
                className="text-xs font-semibold text-konkan-700 hover:underline flex items-center gap-1"
              >
                <Edit2 className="h-3 w-3" /> Edit
              </button>
            </div>
            <p className="text-xs font-semibold text-slate-800">{activityData.meeting_point}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {activityData.address}, {activityData.city}, {activityData.district},{" "}
              {activityData.state}
            </p>
            {activityData.latitude && activityData.longitude && (
              <p className="text-[11px] font-mono text-slate-400 mt-1">
                GPS: {activityData.latitude}, {activityData.longitude}
              </p>
            )}
          </div>

          {/* Section 4: Inclusions & Safety */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-konkan-600" /> Inclusions & Rules
              </h4>
              <button
                type="button"
                onClick={() => onJumpToStep(4)}
                className="text-xs font-semibold text-konkan-700 hover:underline flex items-center gap-1"
              >
                <Edit2 className="h-3 w-3" /> Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-semibold text-slate-900 mb-1.5">Includes:</p>
                <ul className="space-y-1 text-slate-600">
                  {(activityData.inclusions || []).map((inc, i) => (
                    <li key={i}>✓ {inc}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-1.5">What to Bring:</p>
                <ul className="space-y-1 text-slate-600">
                  {(activityData.what_to_bring || []).map((wtb, i) => (
                    <li key={i}>• {wtb}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">Safety Medical Advisory:</p>
              <p className="mt-0.5">{activityData.safety_instructions}</p>
            </div>
          </div>

          {/* Section 5: Rate Packages */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Tag className="h-4 w-4 text-konkan-600" /> Rates ({activityData.rates?.length || 0})
              </h4>
              <button
                type="button"
                onClick={() => onJumpToStep(5)}
                className="text-xs font-semibold text-konkan-700 hover:underline flex items-center gap-1"
              >
                <Edit2 className="h-3 w-3" /> Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {(activityData.rates || []).map((r, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-100 p-3 bg-slate-50/60 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-900">{r.rate_name}</p>
                    <p className="text-[11px] text-slate-500">
                      {r.participant_type} • {r.pricing_unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-konkan-800 text-sm">
                      ₹{Number(r.amount).toLocaleString("en-IN")}
                    </p>
                    {r.is_default && (
                      <span className="text-[10px] font-bold text-emerald-600">Default</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Slots Scheduled */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-konkan-600" /> Availability Slots (
                {activityData.slots?.length || 0})
              </h4>
              <button
                type="button"
                onClick={() => onJumpToStep(6)}
                className="text-xs font-semibold text-konkan-700 hover:underline flex items-center gap-1"
              >
                <Edit2 className="h-3 w-3" /> Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {(activityData.slots || []).map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-100 p-2.5 bg-slate-50/60 flex items-center justify-between"
                >
                  <span className="font-medium text-slate-800">
                    {s.activity_date} ({s.start_time} - {s.end_time})
                  </span>
                  <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                    Cap: {s.capacity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submission Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Previous Step
        </Button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Save className="h-4 w-4 text-slate-500" />
            <span>Save as Draft</span>
          </button>

          <Button
            type="button"
            onClick={handleReviewSubmit}
            disabled={isSubmitting || !canPublish}
            className="flex-1 sm:flex-none"
          >
            <Send className="h-4 w-4 mr-1" />
            <span>{isSubmitting ? "Submitting..." : "Submit for Review"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Step8Review;

