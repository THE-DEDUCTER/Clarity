import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

console.log("URL:", process.env.DATABASE_URL);

async function test() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    console.log('Connected successfully!');
    
    // Test a simple query
    const res = await client.query('SELECT NOW()');
    console.log('Query result:', res.rows[0]);
    
    await client.end();
  } catch(e) {
    console.error('Error connecting:', e);
  }
}
test();
