import { createChatCompletion } from '../../../config';
import { parseGPTJSON } from '../../../utils';

export async function workoutPlanGenerator(params: {
  userData: Record<string, unknown>;
  exercises: unknown[];
}) {
  const finalPrompt = `
    Using the following exercises and user info, create a complete WorkoutPlan JSON object:

    User data: ${JSON.stringify(params.userData, null, 2)}
    Exercises: ${JSON.stringify(params.exercises, null, 2)}

    Return ONLY valid JSON with this shape:
    {
      planName: string,
      goals: string[],
      exercises: { name: string, sets: number, reps: number, rest: string, equipment: string }[],
      nutritionAdvice: {
        calories: number,
        macros: { protein: number, carbs: number, fat: number },
        meals: string[]
      }
    }
  `;

  const planCompletion = await createChatCompletion([
    { role: 'user', content: finalPrompt },
  ]);

  const raw = planCompletion.choices[0].message?.content ?? '';
  return parseGPTJSON(raw);
}
