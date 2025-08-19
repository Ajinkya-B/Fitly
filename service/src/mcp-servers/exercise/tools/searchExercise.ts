import fetch from 'node-fetch';
import { ExerciseApiResponse, FormattedResponse, SearchParams } from '../types';
import {
  EXERCISE_DB_ENDPOINTS,
  DEFAULT_OFFSET,
  DEFAULT_LIMIT,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
} from '../config';

export async function searchExercise({
  search = '',
  offset = DEFAULT_OFFSET,
  limit = DEFAULT_LIMIT,
  sortBy = DEFAULT_SORT_BY,
  sortOrder = DEFAULT_SORT_ORDER,
}: SearchParams): Promise<FormattedResponse> {
  try {
    const url = new URL(EXERCISE_DB_ENDPOINTS.search);
    url.searchParams.set('search', search);
    url.searchParams.set('offset', offset.toString());
    url.searchParams.set('limit', limit.toString());
    url.searchParams.set('sortBy', sortBy);
    url.searchParams.set('sortOrder', sortOrder);

    console.log(`[searchExercise] Fetching exercises with search="${search}"`);
    console.log(`[searchExercise] Request URL: ${url.toString()}`);

    const res = await fetch(url.toString());
    console.log(
      `[searchExercise] Response status: ${res.status} ${res.statusText}`,
    );

    if (!res.ok) {
      throw new Error(
        `Failed to fetch exercises: ${res.status} ${res.statusText}`,
      );
    }

    const data = (await res.json()) as ExerciseApiResponse;

    console.log(
      `[searchExercise] Total exercises received: ${data.data.length}`,
    );

    return {
      total: data.metadata.totalExercises,
      currentPage: data.metadata.currentPage,
      nextPage: data.metadata.nextPage,
      exercises: data.data.map((ex) => ({
        id: ex.exerciseId,
        name: ex.name,
        targetMuscles: ex.targetMuscles,
        equipment: ex.equipments,
        gif: ex.gifUrl,
        instructions: ex.instructions,
      })),
    };
  } catch (err) {
    console.error(
      `[searchExercise] Error fetching exercises for search="${search}":`,
      err,
    );
    throw err;
  }
}
