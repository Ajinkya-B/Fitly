import { ChevronLeft, ChevronRight, Plus, Check } from 'lucide-react';

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
  console.log('current set:', sets[currentSetIndex]);

  return (
    <div className="select-none max-w-md mx-auto">
      <div className="flex items-center gap-4">
        {/* Left arrow */}
        <button
          onClick={() => onSetIndexChange(Math.max(currentSetIndex - 1, 0))}
          className={`p-2 rounded-md bg-gray-200 ${
            currentSetIndex === 0 ? 'invisible' : ''
          }`}
          aria-label="Previous set"
          type="button"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Input container */}
        <div className="border border-muted rounded-lg p-6 flex flex-col gap-6 flex-grow">
          <div className="mb-4 text-center font-medium text-muted-foreground">
            {`Editing Set ${currentSetIndex + 1}`}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Weight (lbs)</label>
            <input
              type="number"
              className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={sets[currentSetIndex].weight}
              onChange={(e) =>
                onUpdateSet(currentSetIndex, 'weight', Number(e.target.value))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Reps</label>
            <input
              type="number"
              className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={sets[currentSetIndex].reps}
              onChange={(e) =>
                onUpdateSet(currentSetIndex, 'reps', Number(e.target.value))
              }
            />
          </div>
        </div>

        {/* Right arrow */}
        <button
          onClick={() =>
            onSetIndexChange(Math.min(currentSetIndex + 1, sets.length - 1))
          }
          className={`p-2 rounded-md bg-gray-200 ${
            isLastStep ? 'invisible' : ''
          }`}
          aria-label="Next set"
          type="button"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Action buttons below inputs, centered */}
      {isLastStep && (
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={onAddSet}
            className="flex items-center justify-center gap-1 px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            type="button"
            aria-label="Add set"
          >
            <Plus size={16} />
            Add Set
          </button>
          <button
            onClick={onComplete}
            className="flex items-center justify-center gap-1 px-4 py-2 text-sm rounded bg-green-600 text-white hover:bg-green-700 transition"
            type="button"
            aria-label="Complete exercise"
          >
            <Check size={16} />
            Complete
          </button>
        </div>
      )}
    </div>
  );
};
