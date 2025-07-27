import { openai } from '../lib';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export async function orchestrate({
  prompt,
  history = [],
  tools = [],
}: {
  prompt: string;
  history?: ChatCompletionMessageParam[];
  tools?: string[];
}): Promise<string> {
  const toolInstructions = tools.length
    ? `You can use tools like:\n${tools.map((t) => `- ${t}`).join('\n')}\n`
    : '';

  const systemPrompt = `You are a smart workout planner.
${toolInstructions}
Respond in structured JSON with: planName, goals, exercises[], nutritionAdvice.`;

  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: prompt },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
    });

    const output = completion.choices[0]?.message?.content;
    return output ?? 'No response from model.';
  } catch (error) {
    console.error('[orchestrate] Error:', error);
    throw new Error('Failed to generate workout plan.');
  }
}
