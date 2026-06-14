require('dotenv').config({ path: '.env' })
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function migrate() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT,
        image TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Users table created!')

    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        tenant_id TEXT NOT NULL UNIQUE,
        email TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Sessions table created!')

    await client.query(`
      CREATE TABLE IF NOT EXISTS archived_emails (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        email_id TEXT NOT NULL,
        archived_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(tenant_id, email_id)
      )
    `)
    console.log('✅ Archived emails table created!')

    await client.query(`
  CREATE TABLE IF NOT EXISTS email_notes (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    email_id TEXT NOT NULL,
    email_subject TEXT,
    email_sender TEXT,
    note TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, email_id)
  )
`)
    console.log('✅ Email notes table created!')

    await client.query(`
      CREATE TABLE IF NOT EXISTS agent_messages (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    await client.query(`
  CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    due_date TIMESTAMP,
    reminder_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
  )
`)
await client.query(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  )
`)
console.log('✅ Todos table created!')
    console.log('✅ Agent messages table created!')

    console.log('✅ All tables migrated successfully!')
  } catch (err) {
    console.error('❌ Migration failed:', err.message)
  } finally {
    client.release()
    pool.end()
  }
}

migrate()