import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { GripVertical, CheckCircle2, Loader, Clock } from 'lucide-react';

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
  time: number; // in minutes
  speed?: number;
  calories?: number;
  status: 'Not Started' | 'In Progress' | 'Complete';
};

type Exercise = StrengthExercise | CardioExercise;

// Initial data with added status and ids
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

const StatusPill = ({ status }: { status: string }) => {
  let icon = null;

  switch (status) {
    case 'Complete':
      icon = <CheckCircle2 className="text-green-600" size={18} />;
      break;
    case 'In Progress':
      icon = <Loader className="text-yellow-600" size={18} />;
      break;
    case 'Not Started':
    default:
      icon = <Clock className="text-gray-500" size={18} />;
      break;
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1 font-semibold text-gray-800">
      {icon}
      {status}
    </span>
  );
};

// Sortable row component that handles both exercise types
const SortableRow = ({ exercise }: { exercise: Exercise }) => {
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
      {/* Drag handle + exercise name */}
      <TableCell className="flex items-center gap-2 cursor-move" {...listeners}>
        <GripVertical size={18} />
        <span>{exercise.name}</span>
      </TableCell>

      {/* Type */}
      <TableCell>
        {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}
      </TableCell>

      {/* Status pill */}
      <TableCell>
        <StatusPill status={exercise.status} />
      </TableCell>

      {/* Sets/Time */}
      <TableCell>
        {exercise.type === 'strength'
          ? exercise.sets
              .map((set) => `${set.reps} reps @ ${set.weight} lbs`)
              .join(', ')
          : `${exercise.time} min`}
      </TableCell>

      {/* Calories */}
      <TableCell>
        {exercise.type === 'cardio' ? (exercise.calories ?? '-') : '-'}
      </TableCell>
    </TableRow>
  );
};

export const PlanDetail = () => {
  const [exercises, setExercises] = useState(initialExercises);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = exercises.findIndex((ex) => ex.id === active.id);
      const newIndex = exercises.findIndex((ex) => ex.id === over?.id);

      setExercises((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

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
              {exercises.map((exercise) => (
                <SortableRow key={exercise.id} exercise={exercise} />
              ))}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
    </div>
  );
};
