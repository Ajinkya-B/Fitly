export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  rest: string;
  equipment: string;
}

export interface NutritionAdvice {
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: string[];
}

export interface WorkoutPlan {
  planName: string;
  goals: string[];
  exercises: WorkoutExercise[];
  nutritionAdvice: NutritionAdvice;
}

export interface FitnessRoadmap {
  phases: Phase[];
}

export interface Phase {
  phaseName: string; // e.g. "Foundation", "Hypertrophy"
  durationWeeks: number; // e.g. 4
  focus: string; // e.g. "Strength building with progressive overload"
  notes: string; // extra tips/reminders for this phase
}

export interface WeeklyPlan {
  weekNumber: number; // which week of the roadmap this belongs to
  days: WorkoutDay[];
  notes: string; // any weekly guidance (e.g. "deload if too fatigued")
}

export interface WorkoutDay {
  day: string; // e.g. "Monday", "Day 1"
  focus: string; // e.g. "Push", "Pull", "Legs", "Full body"
  exercises: Exercise[];
}

export interface Exercise {
  name: string; // e.g. "Barbell Squat"
  sets: number; // number of sets
  reps: number; // target reps per set
  rest: string; // e.g. "90s", "2 min"
  equipment: string; // e.g. "Barbell", "Dumbbell", "Bodyweight"
}

export interface GenerateRoadmapParams {
  userId: string;
  answers: Answers;
  durationWeeks: number;
}

export interface GenerateWeeklyPlanParams {
  userId: string;
  answers: Answers;
  roadmapPhase: string;
  exercises: Exercise[];
  weekNumber: number;
  lastWeekSummary?: WeeklyPerformanceSummary; // optional, concise performance data
}

type Answers = {
  age?: string;
  height?: string;
  weight?: string;
  goal?: string[];
  facilities?: string;
  daysPerWeek?: number;
  activityLevel?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  extraContext?: string;
};

export interface WeeklyPerformanceSummary {
  weekNumber: number;
  adherence: number; // % of planned sessions completed
  feedback?: string; // optional notes from user ("too fatigued", "knees sore")
  progressMetrics?: {
    [exerciseName: string]: {
      setsCompleted: number;
      repsCompleted: number;
      weightUsed?: string; // optional
    };
  };
}
