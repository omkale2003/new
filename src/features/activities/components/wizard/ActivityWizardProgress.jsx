import { Check } from "lucide-react";

export const ACTIVITY_WIZARD_STEPS = [
  { number: 1, label: "Basic Info" },
  { number: 2, label: "Participants" },
  { number: 3, label: "Location" },
  { number: 4, label: "Safety & Rules" },
  { number: 5, label: "Pricing & Rates" },
  { number: 6, label: "Availability" },
  { number: 7, label: "Media" },
  { number: 8, label: "Review & Submit" },
];

export function ActivityWizardProgress({ currentStep = 1, onStepClick }) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="min-w-[860px] px-2 py-3">
        <div className="flex items-start">
          {ACTIVITY_WIZARD_STEPS.map((step, index) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const isLastStep = index === ACTIVITY_WIZARD_STEPS.length - 1;

            return (
              <div key={step.number} className="flex flex-1 items-start">
                {/* Step Circle & Label */}
                <button
                  type="button"
                  onClick={() => onStepClick && onStepClick(step.number)}
                  disabled={!onStepClick || step.number > currentStep}
                  className="flex min-w-0 flex-col items-center cursor-pointer disabled:cursor-default group focus:outline-none"
                >
                  <div
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all",
                      isCompleted
                        ? "border-konkan-700 bg-konkan-700 text-white"
                        : "",
                      isCurrent
                        ? "border-konkan-700 bg-white text-konkan-700 ring-4 ring-konkan-100"
                        : "",
                      !isCompleted && !isCurrent
                        ? "border-slate-300 bg-white text-slate-400 group-hover:border-slate-400"
                        : "",
                    ].join(" ")}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    ) : (
                      step.number
                    )}
                  </div>

                  <p
                    className={[
                      "mt-2 whitespace-nowrap text-[11px] font-semibold transition-colors",
                      isCompleted || isCurrent ? "text-konkan-800" : "text-slate-400",
                    ].join(" ")}
                  >
                    {step.label}
                  </p>
                </button>

                {/* Connector line */}
                {!isLastStep && (
                  <div
                    className={[
                      "mt-[17px] h-0.5 min-w-6 flex-1 transition-colors mx-1",
                      step.number < currentStep ? "bg-konkan-700" : "bg-slate-200",
                    ].join(" ")}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ActivityWizardProgress;

