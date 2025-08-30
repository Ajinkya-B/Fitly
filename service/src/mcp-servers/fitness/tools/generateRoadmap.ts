import { createChatCompletion } from '../../../config';
import { parseGPTJSON } from '../../../utils';
import { FitnessRoadmap, GenerateRoadmapParams } from '../types';

export async function generateRoadmap(
  params: GenerateRoadmapParams,
): Promise<FitnessRoadmap> {
  const { answers, durationWeeks } = params;

  const finalPrompt = `
    You are a fitness coach. Based on this user data, create a high-level fitness roadmap.

    User profile:
    ${JSON.stringify(answers, null, 2)}

    Roadmap should cover ${durationWeeks} weeks.

    Return ONLY JSON with this shape:
    {
      phases: {
        phaseName: string,
        durationWeeks: number,
        focus: string,
        notes: string
      }[]
    }
  `;

  const roadmapCompletion = await createChatCompletion([
    { role: 'user', content: finalPrompt },
  ]);

  const raw = roadmapCompletion.choices[0].message?.content ?? '';
  return parseGPTJSON(raw) as FitnessRoadmap;
}
