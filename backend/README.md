# Quest Backend API

Backend service for the Quest tracking application with user activity tracking, authentication, and caching.

## Features

- **Authentication**: Wallet-based authentication with JWT tokens
- **Daily Tasks**: Track DEX swaps and check-ins with rate limiting
- **User Activity**: Real-time activity tracking with Redis caching
- **Badge System**: NFT badge claiming after completing requirements
- **Rate Limiting**: Daily task limits per user per project
- **Session Management**: Secure session handling with Redis
- **Monitoring**: Comprehensive logging and error handling

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT + Ethereum signature verification
- **Blockchain**: Ethers.js for web3 integration

## Setup

1. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```bash
   # Run migrations (if using Prisma)
   npm run migrate
   ```

4. **Start Redis**
   ```bash
   # Using Docker
   docker run -d -p 6379:6379 redis:alpine
   
   # Or install locally
   redis-server
   ```

5. **Development**
   ```bash
   npm run dev
   ```

6. **Production**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/challenge` - Get authentication challenge
- `POST /api/auth/verify` - Verify wallet signature and get JWT
- `POST /api/auth/logout` - Logout and blacklist token
- `POST /api/auth/refresh` - Refresh JWT token

### Daily Tasks
- `POST /api/daily-tasks/complete` - Complete daily task
- `GET /api/daily-tasks/progress` - Get user progress
- `POST /api/daily-tasks/claim-badge` - Claim NFT badge
- `GET /api/daily-tasks/activity` - Get user activity history
- `GET /api/daily-tasks/stats/:projectId` - Get daily stats

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/stats` - Get user statistics

### Quests
- `GET /api/quests` - Get all quests
- `GET /api/quests/:questId` - Get specific quest

## Configuration

### Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret for JWT token signing
- `API_PORT`: Server port (default: 3001)

### Rate Limiting

Daily task limits:
- DEX Swaps: 5 per day per project
- Check-ins: 1 per day per project

### Caching Strategy

- User progress: 5 minutes
- Quest data: 5 minutes
- User activities: 30 days retention
- Session data: 24 hours

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting on API endpoints
- JWT token blacklisting
- Wallet signature verification
- SQL injection prevention

## Monitoring

- Winston logging with file and console outputs
- Express request logging
- Error tracking and alerting
- Performance monitoring

## Architecture

```
backend/
├── src/
│   ├── config/         # Database and Redis configuration
│   ├── middleware/     # Authentication, logging, validation
│   ├── routes/         # API route handlers
│   └── index.ts        # Application entry point
├── logs/               # Application logs
└── dist/               # Compiled JavaScript
```

## Development

### Adding New Endpoints

1. Create route handler in `src/routes/`
2. Add route to main router in `src/routes/index.ts`
3. Include in main app in `src/index.ts`

### Database Operations

Use the `DatabaseService` class for common database operations:

```typescript
import { DatabaseService } from '../config/database';

// Record daily task
await DatabaseService.recordDailyTask(userId, taskType, projectId);

// Get user progress
const progress = await DatabaseService.getUserProgress(userId);
```

### Caching

Use `CacheService` for Redis operations:

```typescript
import { CacheService } from '../config/redis';

// Cache data
await CacheService.set('key', data, ttl);

// Get cached data
const data = await CacheService.get('key');

// Track user activity
await CacheService.trackUserActivity(userId, 'action');
```

## Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment

Ensure the following services are available:
- PostgreSQL database
- Redis cache
- Environment variables configured

## License

MIT License