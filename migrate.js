import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

migrate(db, { migrationsFolder: 'drizzle' })
  .then(() => {
    console.log('Migration complete!');
    process.exit(0);
  })
  .catch(e => {
    console.error('Migration failed:', e);
    process.exit(1);
  });
