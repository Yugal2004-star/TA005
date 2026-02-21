import rateLimit from 'express-rate-limit';

export const createLimiter = () => rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Try again in 15 minutes.' },
});
