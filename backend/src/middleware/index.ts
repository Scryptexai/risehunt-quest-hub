import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import winston from 'winston';
import expressWinston from 'express-winston';
import { CacheService } from '../config/redis';

// Logger configuration
export const logger = expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
    winston.format.timestamp()
  ),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
});

// Error handler
export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation Error', details: error.message });
  }
  
  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  if (error.code === '23505') { // PostgreSQL unique violation
    return res.status(409).json({ error: 'Resource already exists' });
  }
  
  res.status(500).json({ error: 'Internal Server Error' });
};

// Authentication middleware
export interface AuthRequest extends Request {
  user?: {
    id: string;
    address: string;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }
    
    // Check if token is blacklisted (cached)
    const isBlacklisted = await CacheService.exists(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    
    // Track user activity
    await CacheService.trackUserActivity(decoded.id, `${req.method} ${req.path}`);
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      const isBlacklisted = await CacheService.exists(`blacklist:${token}`);
      if (!isBlacklisted) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        req.user = decoded;
        await CacheService.trackUserActivity(decoded.id, `${req.method} ${req.path}`);
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Request validation middleware
export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        details: error.details.map((d: any) => d.message) 
      });
    }
    next();
  };
};

// Cache middleware
export const cacheMiddleware = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = `cache:${req.originalUrl}`;
      const cached = await CacheService.get(key);
      
      if (cached) {
        return res.json(cached);
      }
      
      // Override res.json to cache the response
      const originalJson = res.json;
      res.json = function(body: any) {
        CacheService.set(key, body, ttl);
        return originalJson.call(this, body);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
};