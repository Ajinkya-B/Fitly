import { Router, Request, Response } from 'express';
import { orchestrate } from '../mcp-host/orchestrator';
import { logger } from '../utils';
import { Answers, FitnessRoadmap } from '../types';

const router = Router();

type GetUserFitnessRoadmapBody = {
  userId: string;
  durationWeeks: number;
  answers: Answers;
};

router.post(
  '/',
  async (
    req: Request<Record<string, never>, unknown, GetUserFitnessRoadmapBody>,
    res: Response<FitnessRoadmap | { error: string }>,
  ): Promise<void> => {
    const { userId, durationWeeks, answers } = req.body;

    if (!userId) {
      logger.error('getUserFitnessRoadmap', 'userId not provided');
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    const initialPrompt = `
        The user wants a personalized ${durationWeeks}-week fitness roadmap.
        
        User profile:
        ${JSON.stringify(answers, null, 2)}
        
        Your goal: create a clear multi-phase roadmap that matches this profile.
    `;

    const persistedInput = `
        If you have already called a tool that produced the requested roadmap, 
        and the output includes phases, duration, and focus, then the task is complete. 
        Return EXACTLY "DONE".
    `;

    try {
      logger.info('getUserFitnessRoadmap', 'Sending prompt to orchestrator');

      const response = await orchestrate<
        GetUserFitnessRoadmapBody,
        FitnessRoadmap
      >({
        userId,
        input: initialPrompt,
        persistedInput,
        toolParams: { userId, answers, durationWeeks },
      });

      logger.info(
        'getUserFitnessRoadmap',
        `Response: ${JSON.stringify(response, null, 2)}`,
      );

      if (response.output && 'phases' in response.output) {
        res.json(response.output as FitnessRoadmap);
      } else {
        logger.error('getUserFitnessRoadmap', 'Invalid roadmap format');
        res
          .status(500)
          .json({ error: 'Invalid roadmap format from orchestrator' });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      logger.error('getUserFitnessRoadmap', `Error: ${message}`);
      res.status(500).json({ error: message });
    }
  },
);

export default router;
