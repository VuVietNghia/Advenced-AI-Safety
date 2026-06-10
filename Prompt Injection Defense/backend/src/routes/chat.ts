import { Router, Request, Response } from 'express';
import { processChatRequest, stats } from '../defense';

export const chatRouter = Router();

chatRouter.post('/', async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required and must be a string' });
  }

  try {
    const response = await processChatRequest(message);
    res.json(response);
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

chatRouter.get('/stats', (req: Request, res: Response) => {
  res.json(stats);
});
