import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { database, pool } from './setup';

(async () => {
  try {
    await migrate(database, { migrationsFolder: 'sql' });
    console.log('Migration complete');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end(); // Properly close the connection
  }
})();