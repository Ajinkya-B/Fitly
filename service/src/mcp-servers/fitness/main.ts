import * as Tools from './tools';
import type { MCPServer, ToolDefinition } from '../../types';
import type {
  FitnessRoadmap,
  GenerateRoadmapParams,
  WeeklyPlan,
  WorkoutPlan,
} from './types';

// Map tool names to their expected parameter types
type ToolParams = {
  workoutPlanGenerator: {
    userData: Record<string, unknown>;
    exercises: unknown[];
  };
  generateRoadmap: { params: GenerateRoadmapParams };
  generateWeeklyPlan: {
    userData: Record<string, unknown>;
    roadmapPhase: string;
    exercises: unknown[];
    weekNumber: number;
  };
};

// Map tool names to their return/output types
type ToolReturnTypes = {
  workoutPlanGenerator: WorkoutPlan;
  generateRoadmap: FitnessRoadmap;
  generateWeeklyPlan: WeeklyPlan;
};

export class FitnessServer implements MCPServer {
  private tools: Record<string, ToolDefinition> = {
    workoutPlanGenerator: {
      name: 'workoutPlanGenerator',
      description: 'Generates a workout plan based on user data and exercises',
      parameters: {
        userData: 'User data object',
        exercises: 'Array of exercise objects',
      },
    },
    generateRoadmap: {
      name: 'generateRoadmap',
      description:
        'Generates a multi-week fitness roadmap (phases, focus, duration)',
      parameters: {
        userId: 'string',
        answers: 'Answers',
        durationWeeks: 'number',
      },
    },
    generateWeeklyPlan: {
      name: 'generateWeeklyPlan',
      description: 'Generates a detailed weekly workout plan given a roadmap',
      parameters: {
        weekNumber: 'number',
        roadmap: 'FitnessRoadmap',
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
