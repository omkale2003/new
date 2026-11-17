import { useForm } from "react-hook-form";
import Input from "../../../../components/ui/Input/Input.jsx";
import Button from "../../../../components/ui/Button/Button.jsx";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";

export function Step2Requirements({ initialData, onNext, onPrev }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      min_participants: initialData?.min_participants || 1,
      max_participants: initialData?.max_participants || 12,
      min_age: initialData?.min_age || 10,
      max_age: initialData?.max_age || 60,
      min_weight_kg: initialData?.min_weight_kg || 30,
      max_weight_kg: initialData?.max_weight_kg || 110,
    },
  });

  const onSubmit = (formData) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900">Step 2 — Participant Requirements</h3>
        <p className="text-xs text-slate-500">
          Establish party size capacity limits and physical safety constraints for participant bookings.
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Minimum Participants per Booking"
            required
            type="number"
            id="min_participants"
            placeholder="e.g. 1"
            error={errors.min_participants?.message}
            {...register("min_participants", {
              required: "Min participants required",
              min: { value: 1, message: "At least 1 participant" },
            })}
          />
          <Input
            label="Maximum Capacity per Slot"
            required
            type="number"
            id="max_participants"
            placeholder="e.g. 12"
            error={errors.max_participants?.message}
            {...register("max_participants", {
              required: "Max capacity required",
              min: { value: 1, message: "Capacity must be at least 1" },
            })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Minimum Age (Years)"
            required
            type="number"
            id="min_age"
            placeholder="e.g. 10"
            error={errors.min_age?.message}
            {...register("min_age", {
              required: "Min age is required",
              min: { value: 1, message: "Invalid age" },
            })}
          />
          <Input
            label="Maximum Age (Years)"
            required
            type="number"
            id="max_age"
            placeholder="e.g. 65"
            error={errors.max_age?.message}
            {...register("max_age", {
              required: "Max age is required",
              min: { value: 1, message: "Invalid age" },
            })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Minimum Weight (kg)"
            type="number"
            id="min_weight_kg"
            placeholder="e.g. 30 (Optional / for harness)"
            {...register("min_weight_kg")}
          />
          <Input
            label="Maximum Weight (kg)"
            type="number"
            id="max_weight_kg"
            placeholder="e.g. 110 (Weight limit for parasail/jet ski)"
            {...register("max_weight_kg")}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-slate-400 mt-0.5" />
          <p className="leading-relaxed">
            These restrictions will automatically validate tourist guest details during online checkout and will print directly onto the manifest liability waiver.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <Button type="submit">
          Next: Meeting Location <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </form>
  );
}

export default Step2Requirements;

