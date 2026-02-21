import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import './config/supabase.js';
import analyzeRoutes from './routes/analyzeRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import { globalErrorHandler } from './middleware/errorHandler.js';
import { createLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use('/api/', createLimiter());

app.use('/api/analyze', analyzeRoutes);
app.use('/api/history', historyRoutes);

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, ts: new Date().toISOString() })
);

app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`TruthLens AI running on :${PORT}`));
