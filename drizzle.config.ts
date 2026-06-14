import type { Config } from 'drizzle-kit'

export default {
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'kundan123',
    database: 'mailflow',
    ssl: false,
  },
} satisfies Config