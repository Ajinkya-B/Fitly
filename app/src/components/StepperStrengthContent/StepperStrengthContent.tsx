import { ChevronLeft, ChevronRight, Plus, Check, Minus } from 'lucide-react';

export const StepperStrengthContent = ({
  sets,
  currentSetIndex,
  onSetIndexChange,
  onAddSet,
  onComplete,
  onUpdateSet,
}: {
  sets: { reps: number; weight: number }[];
  currentSetIndex: number;
  onSetIndexChange: (index: number) => void;
  onAddSet: () => void;
  onComplete: () => void;
  onUpdateSet: (index: number, field: 'weight' | 'reps', value: number) => void;
}) => {
  const isLastStep = currentSetIndex === sets.length - 1;

  const handleStepChange = (field: 'weight' | 'reps', delta: number) => {
    const currentValue = sets[currentSetIndex][field] ?? 0;
    onUpdateSet(currentSetIndex, field, Math.max(0, currentValue + delta));
  };

  return (
    <div className="select-none w-full max-w-sm mx-auto">
      {/* Title */}
      <div className="mb-4 text-center font-semibold text-lg">
        {`Set ${currentSetIndex + 1}`}
      </div>

      {/* Card with inputs */}
      <div className="bg-white rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.06)] p-6 flex flex-col gap-6">
        {/* Weight Control */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-500 text-center">
            Weight (lbs)
          </label>
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
            <button
              onClick={() => handleStepChange('weight', -5)}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              type="button"
            >
              <Minus size={18} />
            </button>
            <span className="text-lg font-semibold">
              {sets[currentSetIndex].weight}
            </span>
            <button
              onClick={() => handleStepChange('weight', +5)}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              type="button"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Reps Control */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-500 text-center">
            Reps
          </label>
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
            <button
              onClick={() => handleStepChange('reps', -1)}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              type="button"
            >
              <Minus size={18} />
            </button>
            <span className="text-lg font-semibold">
              {sets[currentSetIndex].reps}
            </span>
            <button
              onClick={() => handleStepChange('reps', +1)}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              type="button"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Action row (fixed space to avoid layout jumps) */}
      <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4 min-h-[52px]">
        {isLastStep ? (
          <>
            <button
              onClick={onAddSet}
              className="flex items-center justify-center gap-2 px-5 py-3 text-sm rounded-xl border border-gray-300 bg-white hover:bg-gray-100 transition shadow-sm"
              type="button"
            >
              <Plus size={16} />
              Add Set
            </button>
            <button
              onClick={onComplete}
              className="flex items-center justify-center gap-2 px-5 py-3 text-sm rounded-xl bg-green-600 text-white hover:bg-green-700 transition shadow-md"
              type="button"
            >
              <Check size={16} />
              Complete
            </button>
          </>
        ) : (
          <div className="flex justify-between w-full sm:w-auto sm:gap-6">
            <button
              onClick={() => onSetIndexChange(Math.max(currentSetIndex - 1, 0))}
              className={`flex items-center justify-center px-5 py-3 rounded-xl bg-gray-100 shadow-md ${
                currentSetIndex === 0 ? 'invisible' : ''
              }`}
              type="button"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={() =>
                onSetIndexChange(Math.min(currentSetIndex + 1, sets.length - 1))
              }
              className={`flex items-center justify-center px-5 py-3 rounded-xl bg-gray-100 shadow-md ${
                isLastStep ? 'invisible' : ''
              }`}
              type="button"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
