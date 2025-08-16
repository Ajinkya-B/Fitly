import fetch from 'node-fetch';
import {
  EXERCISE_DB_ENDPOINTS,
  DEFAULT_OFFSET,
  DEFAULT_LIMIT,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
} from '../config';
import { ExerciseApiResponse, FormattedResponse } from '../types';

export async function getExercisesByTarget({
  target,
  offset = 0,
  limit = 10,
  sortBy = 'targetMuscles',
  sortOrder = 'desc',
}: {
  target: string;
  offset?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<FormattedResponse> {
  const url = new URL(EXERCISE_DB_ENDPOINTS.byTarget(target));
  url.searchParams.set('offset', (offset ?? DEFAULT_OFFSET).toString());
  url.searchParams.set('limit', (limit ?? DEFAULT_LIMIT).toString());
  url.searchParams.set('sortBy', sortBy ?? DEFAULT_SORT_BY);
  url.searchParams.set('sortOrder', sortOrder ?? DEFAULT_SORT_ORDER);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(
      `Failed to fetch exercises: ${res.status} ${res.statusText}`,
    );
  }

  const data = (await res.json()) as ExerciseApiResponse;

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
}
