import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import ActivityWizardProgress from "../components/wizard/ActivityWizardProgress.jsx";
import Step1BasicInfo from "../components/wizard/Step1BasicInfo.jsx";
import Step2Requirements from "../components/wizard/Step2Requirements.jsx";
import Step3Location from "../components/wizard/Step3Location.jsx";
import Step4InclusionsSafety from "../components/wizard/Step4InclusionsSafety.jsx";
import Step5Pricing from "../components/wizard/Step5Pricing.jsx";
import Step6Availability from "../components/wizard/Step6Availability.jsx";
import Step7Media from "../components/wizard/Step7Media.jsx";
import Step8Review from "../components/wizard/Step8Review.jsx";
import { useActivity, useUpdateActivity } from "../hooks/useActivities.js";
import { ACTIVITY_PROVIDER_ROUTES } from "../../../constants/routes.js";

export function EditActivityPage() {
  const { activityId } = useParams();
  const navigate = useNavigate();

  const { data: existingData, isLoading, isError } = useActivity(activityId);
  const updateMutation = useUpdateActivity();

  const [currentStep, setCurrentStep] = useState(1);
  const [activityData, setActivityData] = useState(null);

  useEffect(() => {
    if (existingData) {
      setActivityData(existingData);
    }
  }, [existingData]);

  if (isLoading || !activityData) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-16 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-konkan-600 mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading activity details...</p>
      </div>
    );
  }

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
      await updateMutation.mutateAsync({
        id: activityId,
        patch: { ...activityData, status: "Draft" },
      });
      navigate(ACTIVITY_PROVIDER_ROUTES.ACTIVITIES);
    } catch (err) {
      alert(err?.message || "Failed to update activity draft.");
    }
  };

  const handleSubmitForReview = async () => {
    try {
      await updateMutation.mutateAsync({
        id: activityId,
        patch: { ...activityData, status: "Pending Review" },
      });
      navigate(ACTIVITY_PROVIDER_ROUTES.ACTIVITIES);
    } catch (err) {
      alert(err?.message || "Failed to submit activity for review.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to={ACTIVITY_PROVIDER_ROUTES.ACTIVITIES}
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Edit Activity: {activityData.name}
          </h1>
          <p className="text-xs text-slate-500">
            ID: <span className="font-mono text-slate-700">{activityId}</span> • Current Status:{" "}
            <span className="font-semibold text-slate-800">{activityData.status}</span>
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-xs">
        <ActivityWizardProgress currentStep={currentStep} onStepClick={handleJumpToStep} />
      </div>

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
            isSubmitting={updateMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}

export default EditActivityPage;

