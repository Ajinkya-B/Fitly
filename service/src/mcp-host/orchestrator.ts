import { ClientManager } from './clientManager';
import { SessionManager } from './sessionManager';
import { createChatCompletion } from '../config';
import { logger } from '../utils';
import { ToolDefinition, ToolInput, ToolOutput } from './types';

export type MCPContext = {
  lastInput: string;
  lastOutput?: ToolOutput;
  lastToolUsed?: string;
};

const sessionManager = new SessionManager<MCPContext>(1000 * 60 * 60); // 1h TTL

// We'll inject the bootstrap's clientManager into orchestrator
let clientManager: ClientManager | null = null;

export function setClientManager(cm: ClientManager): void {
  clientManager = cm;
}

export type OrchestratorRequest<TParams extends ToolInput = ToolInput> = {
  userId: string;
  input: string;
  persistedInput?: string;
  toolName?: string; // if GPT must NOT decide on first call
  toolParams?: TParams;
};

export type OrchestratorResponse<
  TContext = MCPContext,
  TOutput = ToolOutput,
> = {
  output: TOutput | null;
  toolUsed?: string;
  context?: TContext;
};

export async function orchestrate<
  TParams extends ToolInput = ToolInput,
  TOutput extends ToolOutput = ToolOutput,
>({
  userId,
  input,
  persistedInput = '',
  toolName,
  toolParams = {} as TParams,
}: OrchestratorRequest<TParams>): Promise<
  OrchestratorResponse<MCPContext, TOutput>
> {
  if (!clientManager) {
    throw new Error(
      '❌ Orchestrator has no clientManager. Did you forget to call setClientManager() in bootstrap?',
    );
  }

  // Ensure session
  let session = sessionManager.getSession(userId);
  if (!session) {
    sessionManager.setSession(userId, { lastInput: input });
    session = sessionManager.getSession(userId)!;
  }

  let currentInput = input;
  let lastOutput: ToolOutput | null = null;
  let toolUsed: string | undefined;

  const tools: ToolDefinition[] = clientManager.getTools();

  // Allow up to 5 chained tool calls
  for (let step = 0; step < 5; step++) {
    let selectedTool: ToolDefinition | undefined;

    if (toolName && step === 0) {
      // forced tool selection on first step
      selectedTool = tools.find((t) => t.name === toolName);
    } else {
      // Let GPT orchestrate tool choice
      const decisionPrompt = `
        You are an orchestrator. Based on the user input, decide which tool to call next.

        Current task context:
        ${currentInput}
        ${persistedInput}

        Available tools:
        ${tools
          .map(
            (t) =>
              `- ${t.name}: ${t.description}. Parameters: ${JSON.stringify(
                t.parameters,
              )}`,
          )
          .join('\n')}

        If the task is complete, return EXACTLY "DONE".
        Otherwise, return ONLY the tool name to call next.
      `;

      const completion = await createChatCompletion([
        { role: 'user', content: decisionPrompt },
      ]);
      const toolChoice = completion.choices[0].message?.content?.trim();

      logger.info(
        'orchestrator',
        `GPT decision at step ${step}: ${toolChoice}`,
      );

      if (toolChoice === 'DONE') break;
      selectedTool = tools.find((t) => t.name === toolChoice);
    }

    if (!selectedTool) {
      logger.error(
        'orchestrator',
        `No valid tool selected at step ${step} with input: ${currentInput}`,
      );
      throw new Error(`No valid tool selected at step ${step}`);
    }

    logger.info(
      'orchestrator',
      `Selected tool: ${selectedTool.name} for step ${step}`,
    );
    toolUsed = selectedTool.name;

    // Execute tool via clientManager
    lastOutput = await clientManager.executeTool(selectedTool.name, toolParams);

    // Update session
    sessionManager.updateSession(userId, {
      lastInput: currentInput,
      lastToolUsed: selectedTool.name,
      lastOutput,
    });

    currentInput = `
      The previous tool (${selectedTool.name}) produced this output:
      ${JSON.stringify(lastOutput)}
    `;
  }

  return {
    output: lastOutput as TOutput,
    toolUsed,
    context: session.context,
  };
}
