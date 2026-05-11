import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'marathon',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'admin123',
  },
  migrations: {
    directory: './src/infrastructure/database/postgres/migrations',
    extension: 'ts',
  },
};

export default config;