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

export type Exercise = StrengthExercise | CardioExercise;
