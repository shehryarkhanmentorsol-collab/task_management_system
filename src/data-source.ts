import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

// Determine if we're running from compiled code (dist/) or source (src/)
const isCompiled = __dirname.includes('dist');

const migrationsPath = isCompiled
  ? __dirname + '/db/migrations/*.js'
  : __dirname + '/db/migrations/*{.ts,.js}';

const config = new DataSource({
  type: 'mysql',
  database: process.env.DB_NAME || process.env.DB_DATABASE || '',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [migrationsPath],
  migrationsTableName: 'migrations',
});

export default config;
