import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import { app } from './app';

// Define __dirname safely in Node ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

// Resolve dist path reliably across cloud hosting and local dev
const distFromDirname = path.resolve(__dirname, '../dist');
const distFromCwd = path.resolve(process.cwd(), 'dist');
const distPath = fs.existsSync(distFromDirname) ? distFromDirname : distFromCwd;

app.use(express.static(distPath));

// For SPA routing, redirect non-API calls to index.html
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('NEONVOX Social Platform running on port ' + PORT);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[NEONVOX Express Server] listening on port ${PORT}`);
});
