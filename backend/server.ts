import path from 'path';
import express from 'express';
import { app } from './app';

const PORT = process.env.PORT || 3000;

// In production, serve the built frontend dist
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// For SPA routing, redirect non-API calls to index.html
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('NEONVOX Social Platform API running on port ' + PORT);
    }
  });
});

app.listen(PORT, () => {
  console.log(`[NEONVOX Express Server] listening on port ${PORT}`);
});
