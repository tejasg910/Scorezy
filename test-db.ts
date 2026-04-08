// test-db.ts
import { neon } from "@neondatabase/serverless";
import "dotenv/config";
const sql = neon(process.env.DATABASE_URL!);

async function test() {
  try {
    const res = await sql`SELECT 1 as result`;
    console.log("✅ DB Connected:", res);
  } catch (err) {
    console.error("❌ DB Failed:", err);
  }
}

test();