// Tool input must always be an object (can be extended per tool)
export type ToolInput = Record<string, unknown>;

// Tool output can be anything JSON-serializable
export type ToolOutput = unknown;

export type ToolDefinition = {
  name: string;
  description: string;
  parameters: Record<string, string>; // param name -> description
};

export interface MCPTool extends ToolDefinition {
  execute: (params: ToolInput) => Promise<ToolOutput>;
}

export interface MCPServer {
  getTools(): Promise<ToolDefinition[]>;
  executeTool(name: string, params?: ToolInput): Promise<ToolOutput>;
}
