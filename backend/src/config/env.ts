import * as dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  nodeEnv: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  nodeEnv: process.env.NODE_ENV || 'development',
};

// Validate required environment variables
if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

if (!config.jwtSecret || config.jwtSecret === 'your-secret-key') {
  console.warn('⚠️  Warning: Using default JWT_SECRET. Please set a secure JWT_SECRET in .env');
}

export default config;