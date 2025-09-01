import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { StepperStrengthContent } from '@/components';
import { Exercise } from '@/types/Exercise';
import { useAppContext } from '@/hooks/useAppContext';

interface ExerciseTrackingModalProps {
  activeExercise: Exercise | null;
  setActiveExercise: (exercise: Exercise | null) => void;
  currentSetIndex: number;
  setCurrentSetIndex: (index: number) => void;
}

export const ExerciseTrackingModal = ({
  activeExercise,
  setActiveExercise,
  currentSetIndex,
  setCurrentSetIndex,
}: ExerciseTrackingModalProps) => {
  const { setDayExercises, dayExercises } = useAppContext();
  return (
    <Dialog
      open={!!activeExercise}
      onOpenChange={() => {
        setActiveExercise(null);
        setCurrentSetIndex(0); // Reset index when dialog closes
      }}
    >
      <DialogContent
        className="sm:max-w-[600px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {activeExercise?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="py-2">
          {activeExercise?.type === 'strength' ? (
            <StepperStrengthContent
              sets={activeExercise.sets ?? []}
              currentSetIndex={currentSetIndex}
              onSetIndexChange={setCurrentSetIndex}
              onAddSet={() => {
                const newSets = [
                  ...(activeExercise.sets ?? []),
                  { reps: 0, weight: 0 },
                ];
                setActiveExercise({ ...activeExercise, sets: newSets });
                setCurrentSetIndex(newSets.length - 1);
              }}
              onComplete={() => {
                setDayExercises(
                  dayExercises.map((ex) =>
                    ex.id === activeExercise.id
                      ? {
                          ...ex,
                          status: 'Complete',
                          sets: activeExercise.sets,
                        }
                      : ex,
                  ),
                );
                setActiveExercise(null);
                setCurrentSetIndex(0);
              }}
              onUpdateSet={(index, field, value) => {
                if (!activeExercise || activeExercise.type !== 'strength')
                  return;
                const updatedSets = [...(activeExercise.sets ?? [])];
                updatedSets[index] = {
                  ...updatedSets[index],
                  [field]: value,
                };
                setActiveExercise({ ...activeExercise, sets: updatedSets });
              }}
            />
          ) : (
            <div className="text-sm text-muted-foreground">
              Cardio tracking UI here (e.g., time, speed, start/pause).
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
