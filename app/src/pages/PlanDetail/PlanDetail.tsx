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
import { GripVertical } from 'lucide-react';

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
import { StatusPill, StepperStrengthContent } from '@/components';

type StrengthExercise = {
  id: string;
  type: 'strength';
  name: string;
  sets: {
    reps: number;
    weight: number;
  }[];
  status: 'Not Started' | 'In Progress' | 'Complete';
};

type CardioExercise = {
  id: string;
  type: 'cardio';
  name: string;
  time: number;
  speed?: number;
  calories?: number;
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
  },
  {
    id: '2',
    type: 'cardio',
    name: 'Treadmill',
    time: 20,
    speed: 8,
    calories: 220,
    status: 'In Progress',
  },
  {
    id: '3',
    type: 'strength',
    name: 'Squat',
    sets: [
      { reps: 10, weight: 185 },
      { reps: 8, weight: 195 },
    ],
    status: 'Complete',
  },
];

const SortableRow = ({
  exercise,
  onStart,
}: {
  exercise: Exercise;
  onStart: (exercise: Exercise) => void;
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
    </TableRow>
  );
};

export const PlanDetail = () => {
  const [exercises, setExercises] = useState(initialExercises);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const sortedExercises = [...exercises].sort((a, b) => {
    const order = {
      'In Progress': 0,
      'Not Started': 1,
      Complete: 2,
    };
    return order[a.status] - order[b.status];
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = exercises.findIndex((ex) => ex.id === active.id);
      const newIndex = exercises.findIndex((ex) => ex.id === over?.id);
      setExercises((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  useEffect(() => {
    document.body.style.overflow = activeExercise ? 'hidden' : '';
  }, [activeExercise]);

  return (
    <div className="p-4 overflow-x-hidden max-w-full">
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
                <TableHead>Status</TableHead>
                <TableHead>Sets/Time</TableHead>
                <TableHead>Calories</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedExercises.map((exercise) => (
                <SortableRow
                  key={exercise.id}
                  exercise={exercise}
                  onStart={setActiveExercise}
                />
              ))}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>

      {/* Tracking Modal */}
      <Dialog
        open={!!activeExercise}
        onOpenChange={() => setActiveExercise(null)}
      >
        <DialogContent
          className="sm:max-w-[600px]"
          onInteractOutside={(e) => e.preventDefault()} // prevents accidental close
        >
          {/* Header */}
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {activeExercise?.name}
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <div className="py-2">
            {activeExercise?.type === 'strength' ? (
              <StepperStrengthContent
                sets={activeExercise.sets}
                onAddSet={() => {
                  // Add a new empty set (e.g., reps: 0, weight: 0)
                  const newSets = [
                    ...activeExercise.sets,
                    { reps: 0, weight: 0 },
                  ];
                  setActiveExercise({ ...activeExercise, sets: newSets });
                }}
                onComplete={() => {
                  // Handle completion logic, e.g., close modal or update status
                  // Example: mark exercise as Complete and close modal
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
    </div>
  );
};
