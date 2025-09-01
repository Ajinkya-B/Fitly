import { useState, useEffect } from 'react';

import { Plus } from 'lucide-react';
import {
  ExerciseTrackingModal,
  VideoPreviewModal,
  WeeklyCalendar,
  WorkoutExcerciseTable,
} from '@/components';

import { Button } from '@/components/ui/button';
import { Exercise } from '@/types';
import { useAppContext } from '@/hooks';

export const PlanDetail = () => {
  const { fetchDayExercises, fetchWeeklyWorkoutSchedule } = useAppContext();

  useEffect(() => {
    fetchDayExercises();
    fetchWeeklyWorkoutSchedule();
  }, []);

  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

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

      <WorkoutExcerciseTable
        setPreviewVideo={setPreviewVideo}
        setActiveExercise={setActiveExercise}
        setCurrentSetIndex={setCurrentSetIndex}
      />

      {/* Tracking Modal (Unchanged) */}
      <ExerciseTrackingModal
        activeExercise={activeExercise}
        setActiveExercise={setActiveExercise}
        currentSetIndex={currentSetIndex}
        setCurrentSetIndex={setCurrentSetIndex}
      />

      <VideoPreviewModal
        previewVideo={previewVideo}
        setPreviewVideo={setPreviewVideo}
      />
    </div>
  );
};
