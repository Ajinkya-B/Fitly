import { Router } from 'express';
import { orchestrate } from '../orchestrator';

const router = Router();

router.post('/generate', async (req, res) => {
  const userPrompt = req.body.prompt || 'Generate a smart workout plan';
  const history = req.body.history || [];
  const tools = req.body.tools || [
    'exerciseDB',
    'calorieCalculator',
    'runningTracker',
  ];

  try {
    const result = await orchestrate({ prompt: userPrompt, history, tools });
    res.json({ result });
  } catch (err) {
    console.error('[POST /generate]', err);
    res.status(500).json({ error: 'Failed to generate plan' });
  }
});

export default router;
