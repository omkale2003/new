import { useState } from "react";
import Input from "../../../../components/ui/Input/Input.jsx";
import Button from "../../../../components/ui/Button/Button.jsx";
import { ArrowLeft, ArrowRight, Plus, Trash2, Tag, CheckCircle2 } from "lucide-react";

export function Step5Pricing({ initialData, onNext, onPrev }) {
  const [rates, setRates] = useState(() =>
    initialData?.rates?.length
      ? initialData.rates
      : [
          {
            rate_name: "Standard Adult Experience",
            participant_type: "Adult",
            pricing_unit: "Per Person",
            currency: "INR",
            amount: initialData?.base_price || 1999,
            min_quantity: 1,
            max_quantity: 8,
            valid_from: "2024-01-01",
            valid_to: "2025-12-31",
            is_default: true,
            is_active: true,
          },
        ]
  );

  const [currentRate, setCurrentRate] = useState({
    rate_name: "",
    participant_type: "Child",
    pricing_unit: "Per Person",
    currency: "INR",
    amount: "",
    min_quantity: 1,
    max_quantity: 5,
    valid_from: "2024-01-01",
    valid_to: "2025-12-31",
    is_default: false,
    is_active: true,
  });

  const [formError, setFormError] = useState("");

  const handleAddRate = (e) => {
    e.preventDefault();
    if (!currentRate.rate_name.trim()) {
      setFormError("Rate package name is required.");
      return;
    }
    if (!currentRate.amount || Number(currentRate.amount) <= 0) {
      setFormError("Please enter a valid amount greater than 0.");
      return;
    }

    setFormError("");
    setRates([
      ...rates,
      {
        ...currentRate,
        amount: Number(currentRate.amount),
        min_quantity: Number(currentRate.min_quantity) || 1,
        max_quantity: Number(currentRate.max_quantity) || 8,
      },
    ]);

    setCurrentRate({
      rate_name: "",
      participant_type: "Adult",
      pricing_unit: "Per Person",
      currency: "INR",
      amount: "",
      min_quantity: 1,
      max_quantity: 6,
      valid_from: "2024-01-01",
      valid_to: "2025-12-31",
      is_default: false,
      is_active: true,
    });
  };

  const handleRemoveRate = (index) => {
    if (rates.length === 1) {
      alert("At least one pricing rate must be defined.");
      return;
    }
    setRates(rates.filter((_, i) => i !== index));
  };

  const handleSetDefault = (index) => {
    setRates(
      rates.map((r, i) => ({
        ...r,
        is_default: i === index,
      }))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rates.length === 0) {
      setFormError("Please define at least one rate tier.");
      return;
    }
    const defaultRate = rates.find((r) => r.is_default) || rates[0];
    onNext({
      rates,
      base_price: defaultRate.amount,
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900">Step 5 — Pricing & Rate Packages</h3>
        <p className="text-xs text-slate-500">
          Configure participant types, pricing units, discount tiers, and seasonal rate windows.
        </p>
      </div>

      {formError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
          {formError}
        </div>
      )}

      {/* Active Rate Packages List */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Configured Rates ({rates.length})
        </h4>

        <div className="space-y-3">
          {rates.map((rate, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{rate.rate_name}</span>
                  {rate.is_default && (
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      Default Rate
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>Type: <strong className="text-slate-700">{rate.participant_type}</strong></span>
                  <span>•</span>
                  <span>Unit: <strong className="text-slate-700">{rate.pricing_unit}</strong></span>
                  <span>•</span>
                  <span>Min/Max: <strong className="text-slate-700">{rate.min_quantity}-{rate.max_quantity} qty</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-extrabold text-konkan-800">
                    ₹{Number(rate.amount).toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-slate-400">{rate.currency}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  {!rate.is_default && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(idx)}
                      className="rounded-lg border border-slate-200 hover:bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600"
                    >
                      Make Default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveRate(idx)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Rate Form */}
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-5 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
          <Plus className="h-4 w-4 text-konkan-600" /> Add Another Rate Tier
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Rate Tier Name"
            placeholder="e.g. Student Discount Rate"
            value={currentRate.rate_name}
            onChange={(e) => setCurrentRate({ ...currentRate, rate_name: e.target.value })}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Participant Type</label>
            <select
              value={currentRate.participant_type}
              onChange={(e) => setCurrentRate({ ...currentRate, participant_type: e.target.value })}
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-konkan-500"
            >
              <option value="Adult">Adult</option>
              <option value="Child">Child (6-12 Years)</option>
              <option value="Infant">Infant (&lt;6 Years)</option>
              <option value="Student">Student (With ID)</option>
              <option value="Senior">Senior Citizen</option>
              <option value="Any">Any / General</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Pricing Unit</label>
            <select
              value={currentRate.pricing_unit}
              onChange={(e) => setCurrentRate({ ...currentRate, pricing_unit: e.target.value })}
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-konkan-500"
            >
              <option value="Per Person">Per Person</option>
              <option value="Per Group">Per Group</option>
              <option value="Per Session">Per Session</option>
              <option value="Per Hour">Per Hour</option>
              <option value="Private">Private Charter</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Amount (₹ INR)"
            type="number"
            placeholder="e.g. 1499"
            value={currentRate.amount}
            onChange={(e) => setCurrentRate({ ...currentRate, amount: e.target.value })}
          />
          <Input
            label="Min Quantity"
            type="number"
            value={currentRate.min_quantity}
            onChange={(e) => setCurrentRate({ ...currentRate, min_quantity: e.target.value })}
          />
          <Input
            label="Max Quantity"
            type="number"
            value={currentRate.max_quantity}
            onChange={(e) => setCurrentRate({ ...currentRate, max_quantity: e.target.value })}
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleAddRate}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-semibold shadow-xs"
          >
            + Add Rate Tier
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <Button type="button" onClick={handleSubmit}>
          Next: Slot Availability <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

export default Step5Pricing;

