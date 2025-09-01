import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Play, Pencil, Video, RefreshCcw } from 'lucide-react';
import type { Exercise } from '@/types';

export const ExerciseCard = ({
  exercise,
  setActiveExercise,
  setCurrentSetIndex,
  setPreviewVideo,
}: {
  exercise: Exercise;
  setActiveExercise: (ex: Exercise | null) => void;
  setCurrentSetIndex: (i: number) => void;
  setPreviewVideo: (url: string | null) => void;
}) => (
  <div className="rounded-xl border p-3 shadow-sm bg-background">
    {/* Header: Name + Type */}
    <div className="flex justify-between items-center">
      <span className="font-semibold">{exercise.name}</span>
      <span className="text-xs text-muted-foreground capitalize">
        {exercise.type}
      </span>
    </div>

    {/* Sets/Time */}
    <div className="text-sm mt-1 text-muted-foreground">
      {exercise.type === 'strength'
        ? exercise.sets
            ?.map((set) => `${set.reps} reps @ ${set.weight} lbs`)
            ?.join(', ')
        : `${exercise.duration} min`}
    </div>

    {/* Calories (cardio only) */}
    {exercise.type === 'cardio' && (
      <div className="text-sm mt-1">Calories: {exercise.calories ?? '-'}</div>
    )}

    {/* Actions Row */}
    <div className="flex gap-2 mt-3">
      {/* Start */}
      {exercise.status === 'Not Started' && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setActiveExercise(exercise);
                setCurrentSetIndex(0);
              }}
            >
              <Play className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Start Exercise</TooltipContent>
        </Tooltip>
      )}

      {/* Edit (if complete) */}
      {exercise.status === 'Complete' && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setActiveExercise(exercise);
                setCurrentSetIndex(0);
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit Exercise</TooltipContent>
        </Tooltip>
      )}

      {/* Preview */}
      {exercise.videoUrl && exercise.status === 'Not Started' && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPreviewVideo(exercise.videoUrl!)}
            >
              <Video className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>View Technique</TooltipContent>
        </Tooltip>
      )}

      {/* Swap */}
      {exercise.status === 'Not Started' && (
        <Sheet>
          <Tooltip>
            <TooltipTrigger asChild>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <RefreshCcw className="w-4 h-4" />
                </Button>
              </SheetTrigger>
            </TooltipTrigger>
            <TooltipContent>Swap Exercise</TooltipContent>
          </Tooltip>

          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Swap Exercise</SheetTitle>
            </SheetHeader>
            <div className="py-4 text-sm text-muted-foreground">
              Show a list of alternative exercises for: <b>{exercise.name}</b>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  </div>
);
