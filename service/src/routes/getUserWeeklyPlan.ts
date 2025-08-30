import { Router, Request, Response } from 'express';
import { orchestrate } from '../mcp-host/orchestrator';
import { logger } from '../utils';
import { Answers, WeeklyPlan, Exercise } from '../types';

const router = Router();

type GetUserWeeklyPlanBody = {
  userId: string;
  answers: Answers;
  roadmapPhase: string;
  exercises: Exercise[];
  weekNumber: number;
  lastWeekSummary?: {
    weekNumber: number;
    adherence: number;
    feedback?: string;
    progressMetrics?: Record<
      string,
      { setsCompleted: number; repsCompleted: number; weightUsed?: string }
    >;
  };
};

router.post(
  '/',
  async (
    req: Request<Record<string, never>, unknown, GetUserWeeklyPlanBody>,
    res: Response<WeeklyPlan | { error: string }>,
  ): Promise<void> => {
    const {
      userId,
      answers,
      roadmapPhase,
      exercises,
      weekNumber,
      lastWeekSummary,
    } = req.body;

    if (!userId) {
      logger.error('getUserWeeklyPlan', 'userId not provided');
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    const extraContext = answers.extraContext || '';

    const initialPrompt = `
        Create a structured weekly plan for week ${weekNumber}.

        User profile:
        ${JSON.stringify(answers, null, 2)}

        Current roadmap phase: ${roadmapPhase}

        Exercises available this week:
        ${JSON.stringify(exercises, null, 2)}

        ${lastWeekSummary ? `Summary of last week's performance: ${JSON.stringify(lastWeekSummary, null, 2)}` : ''}

        ${extraContext ? `Additional user context: ${extraContext}` : ''}

        Return ONLY valid JSON matching the WeeklyPlan shape:
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

    const persistedInput = `
        If you have enough data to produce the final WeeklyPlan, DO NOT output JSON directly. 
        Instead, return ONLY the tool name "generateWeeklyPlan".
    `;

    try {
      logger.info('getUserWeeklyPlan', 'Sending prompt to orchestrator');

      const response = await orchestrate<GetUserWeeklyPlanBody, WeeklyPlan>({
        userId,
        input: initialPrompt,
        persistedInput,
        toolParams: {
          userId,
          answers,
          roadmapPhase,
          exercises,
          weekNumber,
          lastWeekSummary,
        },
      });

      logger.info(
        'getUserWeeklyPlan',
        `Response: ${JSON.stringify(response, null, 2)}`,
      );

      if (response.output && 'days' in response.output) {
        res.json(response.output as WeeklyPlan);
      } else {
        logger.error('getUserWeeklyPlan', 'Invalid weekly plan format');
        res
          .status(500)
          .json({ error: 'Invalid weekly plan format from orchestrator' });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      logger.error('getUserWeeklyPlan', `Error: ${message}`);
      res.status(500).json({ error: message });
    }
  },
);

export default router;
