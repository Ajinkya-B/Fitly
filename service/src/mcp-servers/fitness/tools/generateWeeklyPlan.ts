import { createChatCompletion } from '../../../config';
import { parseGPTJSON } from '../../../utils';
import { WeeklyPlan, GenerateWeeklyPlanParams } from '../types';

export async function generateWeeklyPlan(
  params: GenerateWeeklyPlanParams,
): Promise<WeeklyPlan> {
  const { answers, roadmapPhase, exercises, weekNumber, lastWeekSummary } =
    params;

  const finalPrompt = `
You are a fitness coach. Create a structured weekly plan for week ${weekNumber}.

User profile:
${JSON.stringify(answers, null, 2)}

Current roadmap phase: ${roadmapPhase}

Exercises available this week:
${JSON.stringify(exercises, null, 2)}

${lastWeekSummary ? `Summary of last week's performance: ${JSON.stringify(lastWeekSummary, null, 2)}` : ''}

Return ONLY valid JSON in this shape (do not add extra fields or comments):

{
  "weekNumber": number,
  "days": [
    {
      "day": string,
      "focus": string,
      "exercises": [
        {
          "name": string,
          "sets": number,
          "reps": number,
          "rest": string,
          "equipment": string
        }
      ]
    }
  ],
  "notes": string
}
`;

  const planCompletion = await createChatCompletion([
    { role: 'user', content: finalPrompt },
  ]);

  const raw = planCompletion.choices[0].message?.content ?? '';
  return parseGPTJSON(raw) as WeeklyPlan;
}
