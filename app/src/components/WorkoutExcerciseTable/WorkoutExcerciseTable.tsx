import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from '@/components/ui/table';
import { ChevronUp } from 'lucide-react';

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
} from '@dnd-kit/sortable';
import { WorkoutExcerciseRow } from '@/components';
import { useAppContext } from '@/hooks';
import { Exercise } from '@/types';

interface WorkoutExcerciseTableProps {
  setPreviewVideo: (url: string | null) => void;
  setActiveExercise: (exercise: Exercise | null) => void;
  setCurrentSetIndex: (index: number) => void;
}

export const WorkoutExcerciseTable = ({
  setPreviewVideo,
  setActiveExercise,
  setCurrentSetIndex,
}: WorkoutExcerciseTableProps) => {
  const { dayExercises, setDayExercises } = useAppContext();
  const [isSortedByStatus, setIsSortedByStatus] = useState(false);

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
      const sorted = [...dayExercises].sort(
        (a, b) => order[a.status] - order[b.status],
      );
      setDayExercises(sorted);
      setIsSortedByStatus(true);
    }
    // Optional: you can add toggle logic here if you want
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = dayExercises.findIndex((ex) => ex.id === active.id);
      const newIndex = dayExercises.findIndex((ex) => ex.id === over?.id);
      setDayExercises(arrayMove(dayExercises, oldIndex, newIndex));
      // Once manually reordered, sorting is overridden
      setIsSortedByStatus(false);
    }
  };
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={dayExercises.map((ex) => ex.id)}
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
            {dayExercises.map((exercise) => (
              <WorkoutExcerciseRow
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
  );
};
