import {
  MCPServer,
  MCPTool,
  ToolDefinition,
  ToolInput,
  ToolOutput,
} from './types';

export class MCPClient {
  private server: MCPServer;
  private serverName: string;
  private tools: MCPTool[] = [];

  constructor(serverName: string, server: MCPServer) {
    this.server = server;
    this.serverName = serverName;
  }

  async initialize(): Promise<void> {
    const toolDefs: ToolDefinition[] = await this.server.getTools();
    this.tools = toolDefs.map((t) => ({
      ...t,
      execute: (params: ToolInput): Promise<ToolOutput> =>
        this.server.executeTool(t.name, params),
    }));
  }

  getTools(): MCPTool[] {
    return this.tools;
  }

  getServerName(): string {
    return this.serverName;
  }
}
