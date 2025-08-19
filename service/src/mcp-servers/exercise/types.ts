export interface Exercise {
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  secondaryMuscles: string[];
  instructions: string[];
}

export interface Metadata {
  totalExercises: number;
  totalPages: number;
  currentPage: number;
  previousPage: string | null;
  nextPage: string | null;
}

export interface ExerciseApiResponse {
  success: boolean;
  metadata: Metadata;
  data: Exercise[];
}

export interface FormattedExercise {
  id: string;
  name: string;
  targetMuscles: string[];
  equipment: string[];
  gif: string;
  instructions: string[];
}

export interface FormattedResponse {
  total: number;
  currentPage: number;
  nextPage: string | null;
  exercises: FormattedExercise[];
}

type PaginationParams = {
  offset?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type BodyPartParams = PaginationParams & { bodyPart: string };
export type EquipmentParams = PaginationParams & { equipment: string };
export type TargetParams = PaginationParams & { target: string };
export type SearchParams = PaginationParams & { search?: string };
