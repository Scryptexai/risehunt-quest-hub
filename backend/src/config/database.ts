import { Pool } from 'pg';

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export const getClient = () => {
  return pool.connect();
};

export const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    
    // Test connection
    await client.query('SELECT NOW()');
    console.log('✅ Database connected successfully');
    
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

// Database helper functions
export class DatabaseService {
  static async executeTransaction(queries: Array<{ text: string; params?: any[] }>) {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      
      const results = [];
      for (const query of queries) {
        const result = await client.query(query.text, query.params);
        results.push(result);
      }
      
      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getUserProgress(userId: string) {
    const client = await getClient();
    try {
      const result = await client.query(`
        SELECT 
          project_id,
          total_completions,
          current_streak,
          last_completion_date,
          badge_claimed
        FROM daily_progress 
        WHERE user_id = $1
      `, [userId]);
      
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async recordDailyTask(userId: string, taskType: string, projectId: string, verificationData?: any) {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      
      // Insert daily task
      await client.query(`
        INSERT INTO daily_tasks (user_id, task_type, project_id, verification_data)
        VALUES ($1, $2, $3, $4)
      `, [userId, taskType, projectId, verificationData]);
      
      // Update or create daily progress
      await client.query(`
        INSERT INTO daily_progress (user_id, project_id, total_completions, current_streak, last_completion_date)
        VALUES ($1, $2, 1, 1, CURRENT_DATE)
        ON CONFLICT (user_id, project_id)
        DO UPDATE SET
          total_completions = daily_progress.total_completions + 1,
          current_streak = CASE
            WHEN daily_progress.last_completion_date = CURRENT_DATE THEN daily_progress.current_streak
            WHEN daily_progress.last_completion_date = CURRENT_DATE - INTERVAL '1 day' THEN daily_progress.current_streak + 1
            ELSE 1
          END,
          last_completion_date = CURRENT_DATE,
          updated_at = NOW()
      `, [userId, projectId]);
      
      await client.query('COMMIT');
      return { success: true };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async claimBadge(userId: string, projectId: string) {
    const client = await getClient();
    try {
      const result = await client.query(`
        UPDATE daily_progress 
        SET badge_claimed = true, updated_at = NOW()
        WHERE user_id = $1 AND project_id = $2 AND total_completions >= 20 AND badge_claimed = false
        RETURNING *
      `, [userId, projectId]);
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

export default pool;