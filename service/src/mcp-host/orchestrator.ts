import { tools } from './toolRegistry';
import { SessionManager } from './sessionManager';
import { createChatCompletion } from '../config';
import { logger } from '../utils';

type MCPContext = {
  lastInput: string;
  lastOutput?: unknown;
  lastToolUsed?: string;
};

const sessionManager = new SessionManager<MCPContext>(1000 * 60 * 60); // 1-hour TTL

type OrchestratorRequest<TParams = Record<string, unknown>> = {
  userId: string;
  input: string;
  persistedInput?: string; // optional: input that persists across tool calls
  toolName?: string; // optional: force a specific tool
  toolParams?: TParams;
};

type OrchestratorResponse<TContext = MCPContext, TOutput = unknown> = {
  output: TOutput;
  toolUsed?: string;
  context?: TContext;
};

export async function orchestrate<
  TParams = Record<string, unknown>,
  TOutput = unknown,
>({
  userId,
  input,
  persistedInput = '',
  toolName,
  toolParams = {} as TParams,
}: OrchestratorRequest<TParams>): Promise<
  OrchestratorResponse<MCPContext, TOutput>
> {
  // Ensure session
  let session = sessionManager.getSession(userId);
  if (!session) {
    sessionManager.setSession(userId, { lastInput: input });
    session = sessionManager.getSession(userId)!;
  }

  let currentInput = input;
  let lastOutput: unknown = null;
  let toolUsed: string | undefined;

  // Allow up to 5 chained tool calls
  for (let step = 0; step < 5; step++) {
    let selectedTool;

    if (toolName && step === 0) {
      // if explicitly forced, use that tool first
      selectedTool = tools.find((t) => t.name === toolName);
    } else {
      // Let GPT decide which tool to call next
      const decisionPrompt = `
        You are an orchestrator. Based on the user input, decide which tool to call next.

        Current task context:
        ${currentInput}\n
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

    // Call the tool
    lastOutput = await selectedTool.execute(toolParams);

    // Update context
    sessionManager.updateSession(userId, {
      lastInput: currentInput,
      lastToolUsed: selectedTool.name,
      lastOutput,
    });

    currentInput = `Previous tool (${selectedTool.name}) output: ${JSON.stringify(
      lastOutput,
    )}\nContinue planning if needed.`;
  }

  return {
    output: lastOutput as TOutput,
    toolUsed,
    context: session.context,
  };
}
