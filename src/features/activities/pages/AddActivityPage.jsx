import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import ActivityWizardProgress from "../components/wizard/ActivityWizardProgress.jsx";
import Step1BasicInfo from "../components/wizard/Step1BasicInfo.jsx";
import Step2Requirements from "../components/wizard/Step2Requirements.jsx";
import Step3Location from "../components/wizard/Step3Location.jsx";
import Step4InclusionsSafety from "../components/wizard/Step4InclusionsSafety.jsx";
import Step5Pricing from "../components/wizard/Step5Pricing.jsx";
import Step6Availability from "../components/wizard/Step6Availability.jsx";
import Step7Media from "../components/wizard/Step7Media.jsx";
import Step8Review from "../components/wizard/Step8Review.jsx";
import { useCreateActivity } from "../hooks/useActivities.js";
import activityStorageService from "../services/activityStorage.service.js";
import { ACTIVITY_PROVIDER_ROUTES } from "../../../constants/routes.js";

const DEFAULT_ACTIVITY_STATE = {
  name: "",
  category_id: 2,
  category_name: "Scuba & Snorkeling",
  short_description: "",
  full_description: "",
  experience_type: "Adventure",
  difficulty_level: "Moderate",
  duration_minutes: 120,
  min_participants: 1,
  max_participants: 12,
  min_age: 10,
  max_age: 60,
  min_weight_kg: 30,
  max_weight_kg: 110,
  meeting_point: "",
  address: "",
  city: "Malvan",
  district: "Sindhudurg",
  state: "Maharashtra",
  country: "India",
  latitude: 16.0617,
  longitude: 73.4682,
  inclusions: [
    "Certified Instructor assistance",
    "Full safety gear & approved life jackets",
    "Safety briefing & training session",
  ],
  exclusions: ["Hotel pickup and drop-off", "Personal towels"],
  what_to_bring: ["Quick-dry beachwear", "Towel", "Sunscreen lotion"],
  safety_instructions:
    "Not recommended for pregnant women, individuals with asthma, serious cardiovascular issues, or ear-drum perforations. No alcohol consumption 12 hours prior.",
  cancellation_policy:
    "Full refund if cancelled 48 hours before slot. 50% refund if cancelled 24 hours before. No refund for same-day cancellations.",
  weather_dependent: true,
  base_price: 1999,
  rates: [],
  slots: [],
  media: [],
  cover_image:
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
};

export function AddActivityPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [activityData, setActivityData] = useState(() => {
    const draft = activityStorageService.getDraft();
    return draft || DEFAULT_ACTIVITY_STATE;
  });

  const createMutation = useCreateActivity();

  // Save to draft on step changes
  useEffect(() => {
    activityStorageService.setDraft(activityData);
  }, [activityData]);

  const handleNextStep = (stepPayload) => {
    setActivityData((prev) => ({
      ...prev,
      ...stepPayload,
    }));
    setCurrentStep((prev) => Math.min(8, prev + 1));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleJumpToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
  };

  const handleSaveDraft = async () => {
    try {
      await createMutation.mutateAsync({
        payload: activityData,
        shouldSubmitForReview: false,
      });
      activityStorageService.clearDraft();
      navigate(ACTIVITY_PROVIDER_ROUTES.ACTIVITIES, {
        state: { message: "Activity saved as Draft successfully." },
      });
    } catch (err) {
      alert(err?.message || "Failed to save draft.");
    }
  };

  const handleSubmitForReview = async () => {
    try {
      await createMutation.mutateAsync({
        payload: activityData,
        shouldSubmitForReview: true,
      });
      activityStorageService.clearDraft();
      navigate(ACTIVITY_PROVIDER_ROUTES.ACTIVITIES, {
        state: { message: "Activity submitted for Review successfully." },
      });
    } catch (err) {
      alert(err?.message || "Failed to submit activity for review.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button and page title */}
      <div className="flex items-center gap-4">
        <Link
          to={ACTIVITY_PROVIDER_ROUTES.ACTIVITIES}
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create Activity Listing
          </h1>
          <p className="text-xs text-slate-500">
            Multi-step setup wizard • Complete all 8 sections to submit
          </p>
        </div>
      </div>

      {/* Stepper Card */}
      <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-xs">
        <ActivityWizardProgress currentStep={currentStep} onStepClick={handleJumpToStep} />
      </div>

      {/* Wizard Form Body */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs">
        {currentStep === 1 && (
          <Step1BasicInfo initialData={activityData} onNext={handleNextStep} />
        )}
        {currentStep === 2 && (
          <Step2Requirements
            initialData={activityData}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}
        {currentStep === 3 && (
          <Step3Location
            initialData={activityData}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}
        {currentStep === 4 && (
          <Step4InclusionsSafety
            initialData={activityData}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}
        {currentStep === 5 && (
          <Step5Pricing
            initialData={activityData}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}
        {currentStep === 6 && (
          <Step6Availability
            initialData={activityData}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}
        {currentStep === 7 && (
          <Step7Media
            initialData={activityData}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}
        {currentStep === 8 && (
          <Step8Review
            activityData={activityData}
            onPrev={handlePrevStep}
            onJumpToStep={handleJumpToStep}
            onSaveDraft={handleSaveDraft}
            onSubmitForReview={handleSubmitForReview}
            isSubmitting={createMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}

export default AddActivityPage;

