import { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../../../../components/ui/Input/Input.jsx";
import Button from "../../../../components/ui/Button/Button.jsx";
import { ArrowLeft, ArrowRight, Plus, Trash2, ShieldAlert, CloudRain } from "lucide-react";

export function Step4InclusionsSafety({ initialData, onNext, onPrev }) {
  const [inclusions, setInclusions] = useState(() =>
    initialData?.inclusions?.length
      ? initialData.inclusions
      : [
          "Certified Instructor assistance",
          "Full safety gear & approved life jackets",
          "Safety briefing & training session",
        ]
  );
  const [newInclusion, setNewInclusion] = useState("");

  const [exclusions, setExclusions] = useState(() =>
    initialData?.exclusions?.length
      ? initialData.exclusions
      : ["Hotel pickup and drop-off", "Personal towels and swimwear"]
  );
  const [newExclusion, setNewExclusion] = useState("");

  const [whatToBring, setWhatToBring] = useState(() =>
    initialData?.what_to_bring?.length
      ? initialData.what_to_bring
      : ["Comfortable swimwear / quick-dry clothes", "Towel and dry clothes change", "Sunscreen lotion"]
  );
  const [newWhatToBring, setNewWhatToBring] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      safety_instructions:
        initialData?.safety_instructions ||
        "Not recommended for pregnant women, individuals with asthma, serious cardiovascular issues, or ear-drum perforations. No alcohol consumption 12 hours prior.",
      cancellation_policy:
        initialData?.cancellation_policy ||
        "Full refund if cancelled 48 hours before slot. 50% refund if cancelled 24 hours before. No refund for same-day cancellations.",
      weather_dependent: initialData?.weather_dependent ?? true,
    },
  });

  const addInclusion = () => {
    if (newInclusion.trim()) {
      setInclusions([...inclusions, newInclusion.trim()]);
      setNewInclusion("");
    }
  };

  const removeInclusion = (idx) => {
    setInclusions(inclusions.filter((_, i) => i !== idx));
  };

  const addExclusion = () => {
    if (newExclusion.trim()) {
      setExclusions([...exclusions, newExclusion.trim()]);
      setNewExclusion("");
    }
  };

  const removeExclusion = (idx) => {
    setExclusions(exclusions.filter((_, i) => i !== idx));
  };

  const addWhatToBring = () => {
    if (newWhatToBring.trim()) {
      setWhatToBring([...whatToBring, newWhatToBring.trim()]);
      setNewWhatToBring("");
    }
  };

  const removeWhatToBring = (idx) => {
    setWhatToBring(whatToBring.filter((_, i) => i !== idx));
  };

  const onSubmit = (formData) => {
    onNext({
      ...formData,
      inclusions,
      exclusions,
      what_to_bring: whatToBring,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900">Step 4 — Inclusions & Safety Instructions</h3>
        <p className="text-xs text-slate-500">
          Clearly specify gear provided, prerequisites, equipment recommendations, and cancellation terms.
        </p>
      </div>

      <div className="space-y-6">
        {/* Inclusions */}
        <div>
          <label className="text-sm font-semibold text-slate-900 block mb-2">
            What is Included
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newInclusion}
              onChange={(e) => setNewInclusion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addInclusion();
                }
              }}
              placeholder="e.g. Complimentary HD underwater video clip"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-konkan-500"
            />
            <button
              type="button"
              onClick={addInclusion}
              className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
          <div className="space-y-1.5">
            {inclusions.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg bg-emerald-50/70 border border-emerald-100 px-3 py-1.5 text-xs text-emerald-900"
              >
                <span>✓ {item}</span>
                <button
                  type="button"
                  onClick={() => removeInclusion(idx)}
                  className="text-emerald-700 hover:text-red-600 p-0.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Exclusions */}
        <div>
          <label className="text-sm font-semibold text-slate-900 block mb-2">
            What is Excluded
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newExclusion}
              onChange={(e) => setNewExclusion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addExclusion();
                }
              }}
              placeholder="e.g. Scuba wetsuit rental"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-konkan-500"
            />
            <button
              type="button"
              onClick={addExclusion}
              className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
          <div className="space-y-1.5">
            {exclusions.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg bg-rose-50/70 border border-rose-100 px-3 py-1.5 text-xs text-rose-900"
              >
                <span>✕ {item}</span>
                <button
                  type="button"
                  onClick={() => removeExclusion(idx)}
                  className="text-rose-700 hover:text-red-600 p-0.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* What to bring */}
        <div>
          <label className="text-sm font-semibold text-slate-900 block mb-2">
            What Guests Must Bring
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newWhatToBring}
              onChange={(e) => setNewWhatToBring(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addWhatToBring();
                }
              }}
              placeholder="e.g. Waterproof mobile pouch"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-konkan-500"
            />
            <button
              type="button"
              onClick={addWhatToBring}
              className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
          <div className="space-y-1.5">
            {whatToBring.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg bg-blue-50/70 border border-blue-100 px-3 py-1.5 text-xs text-blue-900"
              >
                <span>• {item}</span>
                <button
                  type="button"
                  onClick={() => removeWhatToBring(idx)}
                  className="text-blue-700 hover:text-red-600 p-0.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Instructions */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-900" htmlFor="safety_instructions">
            Safety & Medical Guidelines <span className="text-red-500">*</span>
          </label>
          <textarea
            id="safety_instructions"
            rows={3}
            className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-konkan-500 focus:ring-2 focus:ring-konkan-100"
            placeholder="Disclose medical conditions, swim requirements, altitude/flight restrictions after dive..."
            {...register("safety_instructions", { required: "Safety guidelines are mandatory" })}
          />
        </div>

        {/* Cancellation Policy */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-900" htmlFor="cancellation_policy">
            Cancellation & Refund Policy <span className="text-red-500">*</span>
          </label>
          <textarea
            id="cancellation_policy"
            rows={2}
            className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-konkan-500 focus:ring-2 focus:ring-konkan-100"
            placeholder="Specify refund percentages and cutoff windows..."
            {...register("cancellation_policy", { required: "Cancellation policy is mandatory" })}
          />
        </div>

        {/* Weather Dependent Toggle */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CloudRain className="h-6 w-6 text-konkan-600" />
            <div>
              <p className="text-sm font-bold text-slate-900">Weather Dependent Activity</p>
              <p className="text-xs text-slate-500">
                Automatic reschedule or 100% refund permitted if coast guard / port issues high wave warnings.
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-slate-300 text-konkan-600 focus:ring-konkan-500"
            {...register("weather_dependent")}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <Button type="submit">
          Next: Pricing & Rates <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </form>
  );
}

export default Step4InclusionsSafety;

