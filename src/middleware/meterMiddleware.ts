import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

export const apiLimiter = rateLimit({
  windowMs: 10 * 1000, // 1 second
  max: 1, // Limit each IP to 1 request per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

export const meterMiddleware = (req: Request, res: Response, next: Function) => {
  // Implement custom metering logic here
  // For example, you can track API usage per user or per endpoint
  console.log(`API call: ${req.method} ${req.path}`);
  next();
};

