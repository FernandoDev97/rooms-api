/* eslint-disable n/no-path-concat */
import 'dotenv/config'
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { env } from './env'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: [`${__dirname}/**/entities/*.{ts,js}`],
  migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
})
