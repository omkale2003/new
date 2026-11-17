import { useForm } from "react-hook-form";
import Input from "../../../../components/ui/Input/Input.jsx";
import Button from "../../../../components/ui/Button/Button.jsx";
import { ArrowRight } from "lucide-react";
import { useActivityCategories } from "../../hooks/useActivities.js";

export function Step1BasicInfo({ initialData, onNext }) {
  const { data: categories = [] } = useActivityCategories();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      category_id: initialData?.category_id || 2,
      short_description: initialData?.short_description || "",
      full_description: initialData?.full_description || "",
      experience_type: initialData?.experience_type || "Adventure",
      difficulty_level: initialData?.difficulty_level || "Moderate",
      duration_minutes: initialData?.duration_minutes || 120,
    },
  });

  const onSubmit = (formData) => {
    const selectedCat = categories.find((c) => Number(c.id) === Number(formData.category_id));
    onNext({
      ...formData,
      category_name: selectedCat?.name || "Water Sports",
      duration_display: `${Math.floor(formData.duration_minutes / 60)}h ${
        formData.duration_minutes % 60 ? `${formData.duration_minutes % 60}m` : ""
      }`.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900">Step 1 — Basic Information</h3>
        <p className="text-xs text-slate-500">
          Provide key headlines, categorization, and narrative summary of the experience.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Activity Name"
          required
          id="name"
          placeholder="e.g. Scuba Diving with Underwater Video in Malvan"
          error={errors.name?.message}
          {...register("name", { required: "Activity name is required" })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="category_id">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category_id"
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-konkan-500 focus:ring-2 focus:ring-konkan-100"
              {...register("category_id", { required: "Category is required" })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="experience_type">
              Experience Type <span className="text-red-500">*</span>
            </label>
            <select
              id="experience_type"
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-konkan-500 focus:ring-2 focus:ring-konkan-100"
              {...register("experience_type")}
            >
              <option value="Adventure">Adventure</option>
              <option value="Water Sports">Water Sports</option>
              <option value="Fun & Leisure">Fun & Leisure</option>
              <option value="Nature & Eco">Nature & Eco</option>
              <option value="Heritage & Culture">Heritage & Culture</option>
              <option value="Wildlife">Wildlife</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="difficulty_level">
              Difficulty Level
            </label>
            <select
              id="difficulty_level"
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-konkan-500 focus:ring-2 focus:ring-konkan-100"
              {...register("difficulty_level")}
            >
              <option value="Easy">Easy (Family / Beginner Friendly)</option>
              <option value="Moderate">Moderate (Basic Fitness Required)</option>
              <option value="Challenging">Challenging (Strong Stamina Needed)</option>
              <option value="Expert">Expert (Certified / Technical Dive)</option>
            </select>
          </div>

          <Input
            label="Duration in Minutes"
            required
            type="number"
            id="duration_minutes"
            placeholder="e.g. 120 (for 2 hours)"
            error={errors.duration_minutes?.message}
            {...register("duration_minutes", {
              required: "Duration is required",
              min: { value: 15, message: "Minimum duration is 15 minutes" },
            })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="short_description">
            Short Description <span className="text-red-500">*</span>
          </label>
          <input
            id="short_description"
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-konkan-500 focus:ring-2 focus:ring-konkan-100"
            placeholder="One line summary for search cards (100-150 characters)"
            {...register("short_description", { required: "Short description is required" })}
          />
          {errors.short_description && (
            <p className="text-xs text-red-600">{errors.short_description.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="full_description">
            Full Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="full_description"
            rows={5}
            className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-konkan-500 focus:ring-2 focus:ring-konkan-100"
            placeholder="Describe the entire experience itinerary, what guests will encounter, gear provided, and training..."
            {...register("full_description", { required: "Full description is required" })}
          />
          {errors.full_description && (
            <p className="text-xs text-red-600">{errors.full_description.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        <Button type="submit" size="md">
          Next: Participant Requirements <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </form>
  );
}

export default Step1BasicInfo;

