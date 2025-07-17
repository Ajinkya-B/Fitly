import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GripVertical, ChevronUp, Plus, RefreshCcw, Video } from 'lucide-react';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  StatusPill,
  StepperStrengthContent,
  WeeklyCalendar,
} from '@/components';

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

type StrengthExercise = {
  id: string;
  type: 'strength';
  name: string;
  sets: {
    reps: number;
    weight: number;
  }[];
  videoUrl?: string;
  status: 'Not Started' | 'In Progress' | 'Complete';
};

type CardioExercise = {
  id: string;
  type: 'cardio';
  name: string;
  time: number;
  speed?: number;
  calories?: number;
  videoUrl?: string;
  status: 'Not Started' | 'In Progress' | 'Complete';
};

type Exercise = StrengthExercise | CardioExercise;

const initialExercises: Exercise[] = [
  {
    id: '1',
    type: 'strength',
    name: 'Bench Press',
    sets: [
      { reps: 8, weight: 135 },
      { reps: 6, weight: 145 },
      { reps: 4, weight: 155 },
    ],
    status: 'Not Started',
    videoUrl: 'https://www.youtube.com/embed/gRVjAtPip0Y',
  },
  {
    id: '2',
    type: 'strength',
    name: 'Squat',
    sets: [
      { reps: 10, weight: 185 },
      { reps: 8, weight: 195 },
    ],
    status: 'Complete',
    videoUrl: 'https://www.youtube.com/embed/YaXPRqUwItQ',
  },
  {
    id: '3',
    type: 'cardio',
    name: 'Treadmill',
    time: 20,
    speed: 8,
    calories: 220,
    status: 'Not Started',
    videoUrl: 'https://www.youtube.com/embed/1SKaYyqQf1Q',
  },
];

const SortableRow = ({
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

export const PlanDetail = () => {
  const [exercises, setExercises] = useState(initialExercises);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isSortedByStatus, setIsSortedByStatus] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Handler to sort by status when user clicks header
  const handleSortByStatus = () => {
    if (!isSortedByStatus) {
      const order = {
        'In Progress': 0,
        'Not Started': 1,
        Complete: 2,
      };
      const sorted = [...exercises].sort(
        (a, b) => order[a.status] - order[b.status],
      );
      setExercises(sorted);
      setIsSortedByStatus(true);
    }
    // Optional: you can add toggle logic here if you want
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = exercises.findIndex((ex) => ex.id === active.id);
      const newIndex = exercises.findIndex((ex) => ex.id === over?.id);
      setExercises((items) => arrayMove(items, oldIndex, newIndex));
      // Once manually reordered, sorting is overridden
      setIsSortedByStatus(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = activeExercise ? 'hidden' : '';
  }, [activeExercise]);

  return (
    <div className="p-4 overflow-x-hidden max-w-full">
      <WeeklyCalendar />

      {/* Add Custom Exercise Button */}
      <div className="flex justify-end my-4">
        <Button variant="default" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Custom Exercise
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={exercises.map((ex) => ex.id)}
          strategy={verticalListSortingStrategy}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exercise</TableHead>
                <TableHead>Type</TableHead>
                <TableHead
                  className="cursor-pointer select-none flex items-center gap-1"
                  onClick={handleSortByStatus}
                  title="Click to sort by status"
                >
                  Status
                  {isSortedByStatus && (
                    <ChevronUp size={16} className="text-muted-foreground" />
                  )}
                </TableHead>
                <TableHead>Sets/Time</TableHead>
                <TableHead>Calories</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {exercises.map((exercise) => (
                <SortableRow
                  key={exercise.id}
                  exercise={exercise}
                  onStart={(ex) => {
                    setActiveExercise(ex);
                    setCurrentSetIndex(0);
                  }}
                  setPreviewVideo={setPreviewVideo}
                />
              ))}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>

      {/* Tracking Modal (Unchanged) */}
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
                sets={activeExercise.sets}
                currentSetIndex={currentSetIndex}
                onSetIndexChange={setCurrentSetIndex}
                onAddSet={() => {
                  const newSets = [
                    ...activeExercise.sets,
                    { reps: 0, weight: 0 },
                  ];
                  setActiveExercise({ ...activeExercise, sets: newSets });
                  setCurrentSetIndex(newSets.length - 1);
                }}
                onComplete={() => {
                  setExercises((exs) =>
                    exs.map((ex) =>
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
                  const updatedSets = [...activeExercise.sets];
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

      <Dialog open={!!previewVideo} onOpenChange={() => setPreviewVideo(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Exercise Technique</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            <iframe
              src={previewVideo || ''}
              title="Exercise Video"
              allowFullScreen
              className="w-full h-full rounded-md"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
