import fetch from 'node-fetch';
import { EXERCISE_DB_ENDPOINTS } from '../config';
import { Exercise } from '../types';

export async function getExerciseById(exerciseId: string): Promise<Exercise> {
  const res = await fetch(EXERCISE_DB_ENDPOINTS.byId(exerciseId));

  if (!res.ok) {
    throw new Error(
      `Failed to fetch exercise: ${res.status} ${res.statusText}`,
    );
  }

  const data = (await res.json()) as Exercise;
  return data;
}
