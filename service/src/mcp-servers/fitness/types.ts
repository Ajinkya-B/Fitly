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
