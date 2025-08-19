import * as Tools from './tools';
import type { MCPServer, ToolOutput, ToolDefinition } from '../../types';
import {
  SearchParams,
  BodyPartParams,
  EquipmentParams,
  TargetParams,
} from './types';

// Map each tool name to its expected parameter type
type ToolParams = {
  getAllExercisesWithSearch: SearchParams;
  getExerciseById: { exerciseId: string };
  getExercisesByBodyPart: BodyPartParams;
  getExercisesByEquipment: EquipmentParams;
  getExercisesByTarget: TargetParams;
  searchExercise: SearchParams;
};

// Map each tool name to its return type
type ToolReturnTypes = {
  getAllExercisesWithSearch: ToolOutput;
  getExerciseById: ToolOutput;
  getExercisesByBodyPart: ToolOutput;
  getExercisesByEquipment: ToolOutput;
  getExercisesByTarget: ToolOutput;
  searchExercise: ToolOutput;
};

export class ExerciseServer implements MCPServer {
  private tools: Record<string, ToolDefinition> = {
    getAllExercisesWithSearch: {
      name: 'getAllExercisesWithSearch',
      description: 'Get all exercises with search and pagination',
      parameters: {
        offset: 'number',
        limit: 'number',
        search: 'string',
        sortBy: 'string',
        sortOrder: '"asc" | "desc"',
      },
    },
    getExerciseById: {
      name: 'getExerciseById',
      description: 'Get an exercise by ID',
      parameters: { exerciseId: 'string' },
    },
    getExercisesByBodyPart: {
      name: 'getExercisesByBodyPart',
      description: 'Get exercises filtered by body part',
      parameters: {
        bodyPart: 'string',
        offset: 'number',
        limit: 'number',
        sortBy: 'string',
        sortOrder: '"asc" | "desc"',
      },
    },
    getExercisesByEquipment: {
      name: 'getExercisesByEquipment',
      description: 'Get exercises filtered by equipment',
      parameters: {
        equipment: 'string',
        offset: 'number',
        limit: 'number',
        sortBy: 'string',
        sortOrder: '"asc" | "desc"',
      },
    },
    getExercisesByTarget: {
      name: 'getExercisesByTarget',
      description: 'Get exercises filtered by target',
      parameters: {
        target: 'string',
        offset: 'number',
        limit: 'number',
        sortBy: 'string',
        sortOrder: '"asc" | "desc"',
      },
    },
    searchExercise: {
      name: 'searchExercise',
      description: 'Search exercises by name or keyword',
      parameters: {
        search: 'string',
        offset: 'number',
        limit: 'number',
        sortBy: 'string',
        sortOrder: '"asc" | "desc"',
      },
    },
  };

  async getTools(): Promise<ToolDefinition[]> {
    return Object.values(this.tools);
  }

  async executeTool<K extends keyof ToolParams>(
    name: K,
    params: ToolParams[K],
  ): Promise<ToolReturnTypes[K]> {
    const tool = Tools[name as keyof typeof Tools] as (
      args: ToolParams[K],
    ) => Promise<ToolReturnTypes[K]>;
    if (!tool) throw new Error(`Tool "${name}" not found.`);
    return await tool(params);
  }
}
