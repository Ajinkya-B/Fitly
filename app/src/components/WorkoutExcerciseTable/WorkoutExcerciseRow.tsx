import { TableRow, TableCell } from '@/components/ui/table';
import { GripVertical, RefreshCcw, Video } from 'lucide-react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { StatusPill } from '@/components';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Exercise } from '@/types';

export const WorkoutExcerciseRow = ({
  exercise,
  onStart,
  setPreviewVideo,
}: {
  exercise: Exercise;
  onStart: (exercise: Exercise) => void;
  setPreviewVideo: (url: string | null) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: isDragging ? '#f9fafb' : undefined,
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes}>
      <TableCell className="flex items-center gap-2 cursor-move" {...listeners}>
        <GripVertical size={18} />
        <span>{exercise.name}</span>
      </TableCell>

      <TableCell>
        {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}
      </TableCell>

      <TableCell>
        <StatusPill
          status={exercise.status}
          onStart={
            exercise.status === 'Not Started'
              ? () => onStart(exercise)
              : undefined
          }
        />
      </TableCell>

      <TableCell>
        {exercise.type === 'strength'
          ? exercise.sets
              .map((set) => `${set.reps} reps @ ${set.weight} lbs`)
              .join(', ')
          : `${exercise.time} min`}
      </TableCell>

      <TableCell>
        {exercise.type === 'cardio' ? (exercise.calories ?? '-') : '-'}
      </TableCell>

      <TableCell className="flex gap-2">
        {/* Video Preview Button with Tooltip */}
        {exercise.videoUrl && (
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

        {/* Swap Button with Tooltip FIXED */}
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
      </TableCell>
    </TableRow>
  );
};
