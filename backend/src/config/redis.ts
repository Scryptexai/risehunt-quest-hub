import Redis from 'ioredis';

// Redis client configuration
export const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT!) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

// Cache utilities
export class CacheService {
  private static readonly DEFAULT_TTL = 3600; // 1 hour in seconds

  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<boolean> {
    try {
      await redisClient.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  static async del(key: string): Promise<boolean> {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  // User activity tracking
  static async trackUserActivity(userId: string, activity: string): Promise<void> {
    try {
      const key = `user_activity:${userId}`;
      const timestamp = Date.now();
      
      await redisClient.zadd(key, timestamp, JSON.stringify({
        activity,
        timestamp,
        date: new Date().toISOString()
      }));
      
      // Keep only last 1000 activities
      await redisClient.zremrangebyrank(key, 0, -1001);
      
      // Set expiry for 30 days
      await redisClient.expire(key, 30 * 24 * 60 * 60);
    } catch (error) {
      console.error('Error tracking user activity:', error);
    }
  }

  // Get user activities
  static async getUserActivities(userId: string, limit: number = 50): Promise<any[]> {
    try {
      const key = `user_activity:${userId}`;
      const activities = await redisClient.zrevrange(key, 0, limit - 1);
      
      return activities.map(activity => JSON.parse(activity));
    } catch (error) {
      console.error('Error getting user activities:', error);
      return [];
    }
  }

  // Daily task rate limiting
  static async checkDailyTaskLimit(userId: string, projectId: string, taskType: string): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const key = `daily_limit:${userId}:${projectId}:${taskType}:${today}`;
      
      const count = await redisClient.get(key);
      const maxLimit = taskType === 'dex_swap' ? 5 : 1;
      
      if (!count) {
        await redisClient.setex(key, 24 * 60 * 60, '1'); // 24 hours TTL
        return true;
      }
      
      const currentCount = parseInt(count);
      if (currentCount >= maxLimit) {
        return false;
      }
      
      await redisClient.incr(key);
      return true;
    } catch (error) {
      console.error('Error checking daily task limit:', error);
      return false;
    }
  }

  // Session management
  static async setSession(sessionId: string, userId: string, data: any): Promise<void> {
    try {
      const key = `session:${sessionId}`;
      await redisClient.setex(key, 24 * 60 * 60, JSON.stringify({ userId, ...data }));
    } catch (error) {
      console.error('Error setting session:', error);
    }
  }

  static async getSession(sessionId: string): Promise<any | null> {
    try {
      const key = `session:${sessionId}`;
      const session = await redisClient.get(key);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  static async deleteSession(sessionId: string): Promise<void> {
    try {
      const key = `session:${sessionId}`;
      await redisClient.del(key);
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  }
}

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

export default redisClient;
