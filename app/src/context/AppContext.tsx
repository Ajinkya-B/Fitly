import { Exercise } from '@/types';
import { createContext, useState, ReactNode } from 'react';

interface AppContextProps {
  user: string | null;
  dayExercises: Exercise[];
  weeklySchedule: WeeklySchedule;
  setUser: (user: string | null) => void;
  setDayExercises: (exercises: Exercise[]) => void;
  fetchDayExercises: (day?: Date) => void;
  getWeeklyFocusLabels: () => string[];
  fetchWeeklyWorkoutSchedule: () => void;
}

type DailySchedule = {
  day: string;
  focus: string;
  exercises: Exercise[];
};

type WeeklySchedule = DailySchedule[];

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [dayExercises, setDayExercises] = useState<Exercise[]>([]);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>([]);

  const DUMMY_EXERCISES: Exercise[] = [
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
      duration: 20,
      speed: 8,
      calories: 220,
      status: 'Not Started',
      videoUrl: 'https://www.youtube.com/embed/1SKaYyqQf1Q',
    },
  ];

  const fetchDayExercises = (day: Date = new Date()) => {
    console.log(`Fetching exercises for ${day.toDateString()}`);
    // send dummy data for now
    setDayExercises(DUMMY_EXERCISES);
  };

  const getWeeklyFocusLabels = () => {
    // get generated weekly schedule
    return weeklySchedule.map((day) => day.focus);
  };

  const fetchWeeklyWorkoutSchedule = () => {
    // get generated weekly schedule
    setWeeklySchedule([
      {
        day: 'Monday',
        focus: 'Push',
        exercises: DUMMY_EXERCISES,
      },
      {
        day: 'Tuesday',
        focus: 'Pull',
        exercises: DUMMY_EXERCISES,
      },
      {
        day: 'Wednesday',
        focus: 'Legs',
        exercises: DUMMY_EXERCISES,
      },
      {
        day: 'Thursday',
        focus: 'Rest',
        exercises: [],
      },
      {
        day: 'Friday',
        focus: 'Back',
        exercises: DUMMY_EXERCISES,
      },
      {
        day: 'Saturday',
        focus: 'Abs',
        exercises: DUMMY_EXERCISES,
      },
      {
        day: 'Sunday',
        focus: 'Cardio',
        exercises: DUMMY_EXERCISES,
      },
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        dayExercises,
        weeklySchedule,
        setUser,
        setDayExercises,
        fetchDayExercises,
        getWeeklyFocusLabels,
        fetchWeeklyWorkoutSchedule,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
