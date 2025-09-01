export type Exercise = {
  id: string;
  type: 'strength' | 'cardio';
  name: string;
  sets?: {
    reps: number;
    weight: number;
  }[];
  duration?: number; // in minutes for cardio
  speed?: number; // in km/h for cardio
  calories?: number; // for cardio
  videoUrl?: string;
  status: 'Not Started' | 'In Progress' | 'Complete';
};
