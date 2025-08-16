import { Router, Request, Response } from 'express';
import { orchestrate } from '../mcp-host/orchestrator';
import { logger } from '../utils';

const router = Router();

type GenerateWorkoutBody = {
  userId: string;
  equipment: string;
  workoutDays: number;
  age: number;
  height: number;
  weight: number;
  activityLevel: string;
  injuries: string[];
  dietPreferences: {
    likes: string[];
    dislikes: string[];
  };
};

type WorkoutPlan = {
  planName: string;
  goals: string[];
  exercises: {
    name: string;
    sets: number;
    reps: number;
    rest: string;
    equipment: string;
  }[];
  nutritionAdvice: {
    calories: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
    meals: string[];
  };
};

router.post(
  '/generate-workout',
  async (
    req: Request<Record<string, never>, unknown, GenerateWorkoutBody>,
    res: Response<WorkoutPlan | { error: string }>,
  ): Promise<void> => {
    const {
      userId,
      equipment,
      workoutDays,
      age,
      height,
      weight,
      activityLevel,
      injuries,
      dietPreferences,
    } = req.body;

    if (!userId) {
      logger.error('generate-workout', `userId not provided in request body`);
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    const initialPrompt = `
        I want to build muscle over the next 3 months. I have access to a ${equipment.toLowerCase()} and can work out ${workoutDays} times a week.
        I am ${age} years old, ${height} cm tall, and weigh ${weight} kg. My activity level is ${activityLevel.toLowerCase()}.
        My injuries or limitations: ${injuries.length ? injuries.join(', ') : 'none'}.
        My dietary preferences include likes: ${dietPreferences.likes.join(', ')}, dislikes: ${dietPreferences.dislikes.join(', ')}.
        You can call any tools available in your toolkit to gather exercises, analyze user data, or perform other tasks. 
        `;

    const persistedInput = `
        If you have enough data to produce the final WorkoutPlan, DO NOT output the JSON yourself. 
        Instead, return ONLY the tool name "workoutPlanGenerator".
        `;

    try {
      logger.info(
        'generate-workout',
        `Sending prompt to orchestrator:\n${initialPrompt}`,
      );

      const response = await orchestrate<GenerateWorkoutBody, WorkoutPlan>({
        userId,
        input: initialPrompt,
        persistedInput,
        toolParams: req.body, // Pass the raw user data so each tool can use it
      });

      logger.info(
        'generate-workout',
        `Orchestrator response:\n${JSON.stringify(response, null, 2)}`,
      );

      if (
        response.output &&
        typeof response.output === 'object' &&
        'planName' in response.output
      ) {
        res.json(response.output as WorkoutPlan);
      } else {
        logger.error(
          'generate-workout',
          `Invalid workout plan format\n${response.output}`,
        );
        res.status(500).json({
          error: 'Invalid workout plan format from orchestrator',
        });
      }
    } catch (err: unknown) {
      logger.error('generate-workout', `Error generating workout plan: ${err}`);
      const message =
        err instanceof Error
          ? err.message
          : 'Unknown error generating workout plan';
      res.status(500).json({ error: message });
    }
  },
);

export default router;
