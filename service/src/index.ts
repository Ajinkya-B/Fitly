import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import generateWorkoutRouter from './routes/generateWorkout';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', generateWorkoutRouter);

// Health check or root
app.get('/', (_req, res) => {
  res.send('MCP Server is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ MCP backend running on http://localhost:${PORT}`);
});
