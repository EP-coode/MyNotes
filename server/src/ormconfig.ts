import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const ormconfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PROT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ['./**/entities/*.{ts,js}'],
  migrations: ['./migrations/*.{ts,js}'],
  cli: {
    migrationsDir: './migrations',
  },
  synchronize: false,
};

// module.exports = config;
