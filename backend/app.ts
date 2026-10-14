import express, { Express, Request, Response, NextFunction } from 'express';
import usersRouter from './routes/users';
import postsRouter from './routes/posts';
import commentsRouter from './routes/comments';
import systemRouter from './routes/system';

export const app: Express = express();

// Standard middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for API calls
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.url.startsWith('/api')) {
    // API request handling
  }
  next();
});

// API Routes
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/system', systemRouter);

// Fallback for missing api endpoints
app.all('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
});
