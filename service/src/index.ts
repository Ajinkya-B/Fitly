import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mcpRouter from './routes/mcp';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/mcp', mcpRouter);

app.listen(PORT, () => {
  console.log(`✅ MCP backend running on http://localhost:${PORT}`);
});
