import * as Tools from './tools';
import type {
  MCPServer,
  ToolInput,
  ToolOutput,
  ToolDefinition,
} from '../../types';

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
  };

  async getTools(): Promise<ToolDefinition[]> {
    return Object.values(this.tools);
  }

  async executeTool(name: string, params: ToolInput): Promise<ToolOutput> {
    const tool = Tools[name as keyof typeof Tools];
    if (!tool) throw new Error(`Tool "${name}" not found.`);

    // Cast ToolInput to the expected type internally
    return (await tool(params as Parameters<typeof tool>[0])) as ToolOutput;
  }
}
