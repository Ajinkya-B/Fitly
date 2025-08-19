import { MCPClient } from './client';
import { MCPTool, MCPServer, ToolInput, ToolOutput } from './types';

export class ClientManager {
  private clients: MCPClient[] = [];
  private toolRegistry: Map<string, MCPTool> = new Map();

  async registerServer(serverName: string, server: MCPServer): Promise<void> {
    const client = new MCPClient(serverName, server);
    await client.initialize();
    this.clients.push(client);

    // Merge tools into registry
    client.getTools().forEach((tool) => {
      if (this.toolRegistry.has(tool.name)) {
        throw new Error(`Tool name conflict: ${tool.name}`);
      }
      this.toolRegistry.set(tool.name, tool);
    });
  }

  getTools(): MCPTool[] {
    return Array.from(this.toolRegistry.values());
  }

  getToolByName(name: string): MCPTool | undefined {
    return this.toolRegistry.get(name);
  }

  async executeTool(name: string, params: ToolInput): Promise<ToolOutput> {
    const tool = this.toolRegistry.get(name);
    if (!tool) throw new Error(`Tool not found: ${name}`);
    return tool.execute(params);
  }
}
