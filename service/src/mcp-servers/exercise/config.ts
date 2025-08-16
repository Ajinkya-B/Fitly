// Base URL for all ExerciseDB API endpoints
export const EXERCISE_DB_API_BASE = 'https://exercisedb-api.vercel.app/api/v1';

// Default pagination and sorting
export const DEFAULT_OFFSET = 0;
export const DEFAULT_LIMIT = 10;
export const DEFAULT_SORT_BY = 'targetMuscles';
export const DEFAULT_SORT_ORDER: 'asc' | 'desc' = 'desc';

// Endpoint paths
export const EXERCISE_DB_ENDPOINTS = {
  search: `${EXERCISE_DB_API_BASE}/exercises/search`,
  getAll: `${EXERCISE_DB_API_BASE}/exercises`,
  byId: (id: string) => `${EXERCISE_DB_API_BASE}/exercises/${id}`,
  byBodyPart: (bodyPart: string) =>
    `${EXERCISE_DB_API_BASE}/bodyparts/${bodyPart}/exercises`,
  byEquipment: (equipment: string) =>
    `${EXERCISE_DB_API_BASE}/equipments/${encodeURIComponent(
      equipment.toLowerCase(),
    )}/exercises`,
  byTarget: (target: string) => `${EXERCISE_DB_API_BASE}/target/${target}`,
};
