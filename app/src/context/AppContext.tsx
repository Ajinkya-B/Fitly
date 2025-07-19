import { Exercise } from '@/types';
import { createContext, useState, ReactNode } from 'react';

interface AppContextProps {
  user: string | null;
  setUser: (user: string | null) => void;
  dayExercises: Exercise[];
  setDayExercises: (exercises: Exercise[]) => void;
  fetchDayExercises: (day?: Date) => void;
  workoutSchedule: string[];
  fetchWorkoutSchedule: () => void;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [dayExercises, setDayExercises] = useState<Exercise[]>([]);
  const [workoutSchedule, setWorkoutSchedule] = useState<string[]>([]);

  const fetchDayExercises = (day: Date = new Date()) => {
    console.log(`Fetching exercises for ${day.toDateString()}`);
    // send dummy data for now
    setDayExercises([
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
    ]);
  };

  const fetchWorkoutSchedule = () => {
    setWorkoutSchedule([
      'Push',
      'Pull',
      'Legs',
      'Rest',
      'Back',
      'Abs',
      'Cardio',
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        dayExercises,
        setDayExercises,
        fetchDayExercises,
        workoutSchedule,
        fetchWorkoutSchedule,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
