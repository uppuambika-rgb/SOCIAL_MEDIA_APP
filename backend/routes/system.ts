import { Router, Request, Response } from 'express';
import { getSystemStatus, initMongoDB } from '../db/mongo';

const router = Router();

// GET system & database health
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const status = await getSystemStatus();
    res.json({ success: true, data: status });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// CONFIGURE / TEST MongoDB connection dynamically
router.post('/configure-db', async (req: Request, res: Response) => {
  try {
    const { mongoUri } = req.body;
    if (!mongoUri || typeof mongoUri !== 'string') {
      return res.status(400).json({ success: false, error: 'Valid mongoUri is required' });
    }

    const result = await initMongoDB(mongoUri.trim());
    const status = await getSystemStatus();

    if (result.success) {
      res.json({ success: true, message: result.message, data: status });
    } else {
      res.status(400).json({ success: false, error: result.message, data: status });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
