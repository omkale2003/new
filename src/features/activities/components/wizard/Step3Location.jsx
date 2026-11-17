import { useForm } from "react-hook-form";
import Input from "../../../../components/ui/Input/Input.jsx";
import Button from "../../../../components/ui/Button/Button.jsx";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";

export function Step3Location({ initialData, onNext, onPrev }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      meeting_point: initialData?.meeting_point || "",
      address: initialData?.address || "",
      city: initialData?.city || "Malvan",
      district: initialData?.district || "Sindhudurg",
      state: initialData?.state || "Maharashtra",
      country: initialData?.country || "India",
      latitude: initialData?.latitude || 16.0617,
      longitude: initialData?.longitude || 73.4682,
    },
  });

  const onSubmit = (formData) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900">Step 3 — Location & Meeting Point</h3>
        <p className="text-xs text-slate-500">
          Where tourists must assemble or report for safety briefing and activity kickoff.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Meeting Point / Landmark"
          required
          id="meeting_point"
          placeholder="e.g. Chivla Beach Watersports Jetty Counter #2"
          error={errors.meeting_point?.message}
          {...register("meeting_point", { required: "Meeting point is required" })}
        />

        <Input
          label="Street Address / Bunder Road"
          required
          id="address"
          placeholder="e.g. Near Old Fish Port, Bunder Road"
          error={errors.address?.message}
          {...register("address", { required: "Street address is required" })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="City / Town"
            required
            id="city"
            placeholder="e.g. Malvan, Tarkarli, Alibaug"
            error={errors.city?.message}
            {...register("city", { required: "City is required" })}
          />
          <Input
            label="District"
            required
            id="district"
            placeholder="e.g. Sindhudurg, Ratnagiri, Raigad"
            error={errors.district?.message}
            {...register("district", { required: "District is required" })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="State"
            required
            id="state"
            placeholder="Maharashtra"
            error={errors.state?.message}
            {...register("state", { required: "State is required" })}
          />
          <Input
            label="Country"
            required
            id="country"
            placeholder="India"
            {...register("country")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="GPS Latitude (Optional)"
            type="number"
            step="any"
            id="latitude"
            placeholder="16.0617"
            {...register("latitude")}
          />
          <Input
            label="GPS Longitude (Optional)"
            type="number"
            step="any"
            id="longitude"
            placeholder="73.4682"
            {...register("longitude")}
          />
        </div>

        <div className="rounded-2xl border border-konkan-100 bg-konkan-50/50 p-4 text-xs text-konkan-800 flex items-center gap-3">
          <MapPin className="h-5 w-5 text-konkan-600 shrink-0" />
          <p>
            Accurate GPS coordinates generate a direct 1-tap Google Maps navigation link inside the guest's booking confirmation SMS and ticket voucher.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <Button type="submit">
          Next: Inclusions & Safety <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </form>
  );
}

export default Step3Location;

