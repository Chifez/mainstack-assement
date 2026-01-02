import { query } from '../index';
import { readFileSync } from 'fs';
import { join } from 'path';

interface Migration {
  id: number;
  name: string;
  applied_at: Date;
}

export async function runMigrations() {
  try {
    // Check if migrations table exists, if not create it
    await query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get list of applied migrations
    const appliedMigrations = await query<Migration>(
      'SELECT * FROM migrations ORDER BY id'
    );
    const appliedNames = new Set(appliedMigrations.map((m) => m.name));

    // Read migration files
    const migrationFiles = [
      '001_initial_schema.sql',
      '002_update_amount_precision.sql',
      '003_add_void_status.sql',
    ];

    for (const migrationFile of migrationFiles) {
      if (appliedNames.has(migrationFile)) {
        console.log(`Migration ${migrationFile} already applied, skipping...`);
        continue;
      }

      console.log(`Running migration ${migrationFile}...`);

      // Use process.cwd() to get the project root
      const migrationPath = join(
        process.cwd(),
        'lib/db/migrations',
        migrationFile
      );
      const migrationSQL = readFileSync(migrationPath, 'utf-8');

      // Execute migration
      await query(migrationSQL);

      // Record migration
      await query('INSERT INTO migrations (name) VALUES ($1)', [migrationFile]);

      console.log(`Migration ${migrationFile} completed successfully`);
    }

    console.log('All migrations completed');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

// Run migrations if this file is executed directly
runMigrations()
  .then(() => {
    console.log('Migrations finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
