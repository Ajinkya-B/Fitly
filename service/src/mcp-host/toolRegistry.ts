import {
  getAllExercisesWithSearch,
  getExerciseById,
  getExercisesByBodyPart,
  getExercisesByEquipment,
  getExercisesByTarget,
  searchExercise,
} from '../mcp-servers/exercise/tools';

import { getBodyPartList, getTargetList } from '../mcp-servers/muscle/tools';

import { getEquipmentList } from '../mcp-servers/equipment/tools';

import { workoutPlanGenerator } from '../mcp-servers/fitness/tools';

export const tools = [
  // === Existing Exercise Tools ===
  {
    name: 'getAllExercisesWithSearch',
    description:
      'Retrieve exercises from ExerciseDB with optional filters and sorting',
    parameters: {
      type: 'object',
      properties: {
        offset: {
          type: 'number',
          description: 'Number of exercises to skip',
          default: 0,
        },
        limit: {
          type: 'number',
          description: 'Max exercises to return (max 25)',
          default: 10,
        },
        search: { type: 'string', description: 'Optional search term' },
        sortBy: {
          type: 'string',
          enum: [
            'name',
            'exerciseId',
            'targetMuscles',
            'bodyParts',
            'equipments',
          ],
        },
        sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
      },
    },
    execute: getAllExercisesWithSearch,
  },
  {
    name: 'getExerciseById',
    description: 'Retrieve a single exercise by its ExerciseDB ID',
    parameters: {
      type: 'object',
      properties: { exerciseId: { type: 'string' } },
      required: ['exerciseId'],
    },
    execute: getExerciseById,
  },
  {
    name: 'getExercisesByBodyPart',
    description: 'Retrieve exercises filtered by a specific body part',
    parameters: {
      type: 'object',
      properties: {
        bodyPart: { type: 'string' },
        offset: { type: 'number' },
        limit: { type: 'number' },
      },
      required: ['bodyPart'],
    },
    execute: getExercisesByBodyPart,
  },
  {
    name: 'getExercisesByEquipment',
    description: 'Retrieve exercises filtered by equipment',
    parameters: {
      type: 'object',
      properties: {
        equipment: { type: 'string' },
        offset: { type: 'number' },
        limit: { type: 'number' },
      },
      required: ['equipment'],
    },
    execute: getExercisesByEquipment,
  },
  {
    name: 'getExercisesByTarget',
    description: 'Retrieve exercises filtered by target muscle',
    parameters: {
      type: 'object',
      properties: {
        target: { type: 'string' },
        offset: { type: 'number' },
        limit: { type: 'number' },
      },
      required: ['target'],
    },
    execute: getExercisesByTarget,
  },
  {
    name: 'searchExercise',
    description: 'Search exercises in ExerciseDB with a keyword',
    parameters: {
      type: 'object',
      properties: {
        search: { type: 'string', required: true },
        offset: { type: 'number', default: 0 },
        limit: { type: 'number', default: 10 },
        sortBy: {
          type: 'string',
          enum: [
            'name',
            'exerciseId',
            'targetMuscles',
            'bodyParts',
            'equipments',
          ],
        },
        sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
      },
    },
    execute: searchExercise,
  },

  // === Muscle / BodyPart Tools ===
  {
    name: 'getBodyPartList',
    description: 'Retrieve the list of all body parts',
    parameters: { type: 'object', properties: {} },
    execute: getBodyPartList,
  },
  {
    name: 'getTargetList',
    description: 'Retrieve the list of all target muscles',
    parameters: { type: 'object', properties: {} },
    execute: getTargetList,
  },

  // === Equipment Tool ===
  {
    name: 'getEquipmentList',
    description: 'Retrieve the list of all available equipment',
    parameters: { type: 'object', properties: {} },
    execute: getEquipmentList,
  },

  // === Workout Plan Generator Tool ===
  {
    name: 'workoutPlanGenerator',
    description:
      'Generate a full workout and nutrition plan from user data and exercises',
    parameters: {
      type: 'object',
      properties: {
        userData: {
          type: 'object',
          description: 'User profile data for workout planning',
          properties: {
            age: { type: 'number' },
            height: { type: 'number' },
            weight: { type: 'number' },
            activityLevel: { type: 'string' },
            injuries: { type: 'array', items: { type: 'string' } },
            dietPreferences: {
              type: 'object',
              properties: {
                likes: { type: 'array', items: { type: 'string' } },
                dislikes: { type: 'array', items: { type: 'string' } },
              },
            },
          },
          required: ['age', 'height', 'weight', 'activityLevel'],
        },
        exercises: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              sets: { type: 'number' },
              reps: { type: 'number' },
              rest: { type: 'string' },
              equipment: { type: 'string' },
            },
          },
        },
      },
      required: ['userData', 'exercises'],
    },
    execute: workoutPlanGenerator,
  },
];
