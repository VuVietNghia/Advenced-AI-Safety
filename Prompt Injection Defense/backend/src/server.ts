import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { chatRouter } from './routes/chat';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/chat', chatRouter);
app.use('/defense', chatRouter); // Reusing for /defense/stats

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Defense Pipeline Backend is running' });
});

app.listen(PORT, () => {
  console.log(`🛡️  Prompt Injection Defense Backend running on http://localhost:${PORT}`);
});
