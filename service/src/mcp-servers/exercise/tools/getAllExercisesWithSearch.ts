import fetch from 'node-fetch';
import {
  DEFAULT_OFFSET,
  DEFAULT_LIMIT,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
  EXERCISE_DB_ENDPOINTS,
} from '../config';
import {
  Exercise,
  ExerciseApiResponse,
  FormattedExercise,
  FormattedResponse,
} from '../types';

export type GetAllExercisesParams = {
  offset?: number;
  limit?: number;
  search?: string;
  sortBy?: 'name' | 'exerciseId' | 'targetMuscles' | 'bodyParts' | 'equipments';
  sortOrder?: 'asc' | 'desc';
};

export const getAllExercisesWithSearch = async ({
  offset = DEFAULT_OFFSET,
  limit = DEFAULT_LIMIT,
  search = '',
  sortBy = DEFAULT_SORT_BY,
  sortOrder = DEFAULT_SORT_ORDER,
}: GetAllExercisesParams): Promise<FormattedResponse> => {
  try {
    const url = new URL(EXERCISE_DB_ENDPOINTS.getAll); // uses new getAll endpoint

    url.searchParams.set('offset', offset.toString());
    url.searchParams.set('limit', limit.toString());
    if (search) url.searchParams.set('search', search);
    url.searchParams.set('sortBy', sortBy.toString());
    url.searchParams.set('sortOrder', sortOrder.toString());

    console.log(`[getAllExercises] Fetching exercises with search="${search}"`);
    console.log(`[getAllExercises] Request URL: ${url.toString()}`);

    const res = await fetch(url.toString());
    console.log(
      `[getAllExercises] Response status: ${res.status} ${res.statusText}`,
    );

    if (!res.ok) {
      throw new Error(
        `Exercise API request failed: ${res.status} ${res.statusText}`,
      );
    }

    const data = (await res.json()) as ExerciseApiResponse;
    console.log(`[getAllExercises] Exercises received: ${data.data.length}`);

    const exercises: FormattedExercise[] = data.data.map((ex: Exercise) => ({
      id: ex.exerciseId,
      name: ex.name,
      targetMuscles: ex.targetMuscles,
      equipment: ex.equipments,
      gif: ex.gifUrl,
      instructions: ex.instructions,
    }));

    return {
      total: data.metadata.totalExercises,
      currentPage: data.metadata.currentPage,
      nextPage: data.metadata.nextPage,
      exercises,
    };
  } catch (err) {
    console.error(`[getAllExercises] Error fetching exercises:`, err);
    throw err;
  }
};
