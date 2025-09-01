import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from '@/components/ui/table';

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
import { WorkoutExcerciseRow } from '@/components'; // keeps your row styling
import { useAppContext } from '@/hooks';
import { Exercise } from '@/types';
import { ExerciseCard } from './ExerciseCard';
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const targeted = dayExercises.filter((ex) => ex.status !== 'Complete');
  const completed = dayExercises.filter((ex) => ex.status === 'Complete');

  // Drag and drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = dayExercises.findIndex((ex) => ex.id === active.id);
      const newIndex = dayExercises.findIndex((ex) => ex.id === over?.id);
      setDayExercises(arrayMove(dayExercises, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-6">
      {/* Targeted / In Progress */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Today's Exercises</h2>

        {/* Mobile cards */}
        <div className="space-y-3 md:hidden">
          {targeted.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              setActiveExercise={setActiveExercise}
              setCurrentSetIndex={setCurrentSetIndex}
              setPreviewVideo={setPreviewVideo}
            />
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={targeted.map((ex) => ex.id)}
              strategy={verticalListSortingStrategy}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exercise</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Sets/Time</TableHead>
                    <TableHead>Calories</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {targeted.map((exercise) => (
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
        </div>
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Completed</h2>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {completed.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                setActiveExercise={setActiveExercise}
                setCurrentSetIndex={setCurrentSetIndex}
                setPreviewVideo={setPreviewVideo}
              />
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exercise</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Sets/Time</TableHead>
                  <TableHead>Calories</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completed.map((exercise) => (
                  <WorkoutExcerciseRow
                    key={exercise.id}
                    exercise={exercise}
                    onStart={() => {}} // no start button for completed
                    setPreviewVideo={setPreviewVideo}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};
