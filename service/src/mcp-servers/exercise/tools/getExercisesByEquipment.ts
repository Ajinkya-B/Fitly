import fetch from 'node-fetch';
import {
  EquipmentParams,
  ExerciseApiResponse,
  FormattedResponse,
} from '../types';
import {
  EXERCISE_DB_ENDPOINTS,
  DEFAULT_OFFSET,
  DEFAULT_LIMIT,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
} from '../config';

export async function getExercisesByEquipment({
  equipment,
  offset = 0,
  limit = 10,
  sortBy = 'targetMuscles',
  sortOrder = 'desc',
}: EquipmentParams): Promise<FormattedResponse> {
  try {
    const url = new URL(EXERCISE_DB_ENDPOINTS.byEquipment(equipment));
    url.searchParams.set('offset', (offset ?? DEFAULT_OFFSET).toString());
    url.searchParams.set('limit', (limit ?? DEFAULT_LIMIT).toString());
    url.searchParams.set('sortBy', sortBy ?? DEFAULT_SORT_BY);
    url.searchParams.set('sortOrder', sortOrder ?? DEFAULT_SORT_ORDER);

    console.log(
      `[getExercisesByEquipment] Fetching exercises for equipment: "${equipment}"`,
    );
    console.log(`[getExercisesByEquipment] Request URL: ${url.toString()}`);

    const res = await fetch(url.toString());

    console.log(
      `[getExercisesByEquipment] Response status: ${res.status} ${res.statusText}`,
    );

    if (!res.ok) {
      throw new Error(
        `Failed to fetch exercises: ${res.status} ${res.statusText}`,
      );
    }

    const data = (await res.json()) as ExerciseApiResponse;

    console.log(
      `[getExercisesByEquipment] Total exercises received: ${data.data.length}`,
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
      `[getExercisesByEquipment] Error fetching exercises for "${equipment}":`,
      err,
    );
    throw err;
  }
}
