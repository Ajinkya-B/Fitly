import * as Tools from './tools';
import type { MCPServer, ToolOutput, ToolDefinition } from '../../types';

export class MuscleServer implements MCPServer {
  private tools: Record<string, ToolDefinition> = {
    getBodyPartList: {
      name: 'getBodyPartList',
      description: 'Get the list of all body parts',
      parameters: {},
    },
    getTargetList: {
      name: 'getTargetList',
      description: 'Get the list of all target muscles',
      parameters: {},
    },
  };

  async getTools(): Promise<ToolDefinition[]> {
    return Object.values(this.tools);
  }

  async executeTool(name: string): Promise<ToolOutput> {
    const tool = Tools[name as keyof typeof Tools];
    if (!tool) throw new Error(`Tool "${name}" not found.`);
    return await tool(); // tools take no input
  }
}
