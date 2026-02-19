import { readdirSync } from "node:fs";
import { join } from "node:path";
import { pool } from "./pool.ts";

const MIGRATIONS_DIR = join(import.meta.dirname, "migrations");

function getMigrationFiles(): string[] {
  const files = readdirSync(MIGRATIONS_DIR).filter((file) =>
    file.endsWith(".sql"),
  );
  return files.sort();
}

function getMigrationVersion(filename: string): string {
  return filename.replace(".sql", "");
}

export async function runMigrations(): Promise<void> {
  const client = await pool.connect();

  try {
    const files = getMigrationFiles();

    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        applied_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const result = await client.query<{ version: string }>(
      "SELECT version FROM schema_migrations",
    );
    const appliedMigrations = new Set(result.rows.map((r) => r.version));

    let appliedCount = 0;

    for (const file of files) {
      const version = getMigrationVersion(file);

      if (appliedMigrations.has(version)) {
        console.log(`Skipping migration: ${file} (already applied)`);
        continue;
      }

      console.log(`Applying migration: ${file}`);

      const sql = await Bun.file(join(MIGRATIONS_DIR, file)).text();

      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query(
          "INSERT INTO schema_migrations (version) VALUES ($1)",
          [version],
        );
        await client.query("COMMIT");
        appliedCount++;
        console.log(`Applied migration: ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw new Error(`Migration ${file} failed: ${error}`);
      }
    }

    if (appliedCount === 0) {
      console.log("No pending migrations to apply");
    } else {
      console.log(`Successfully applied ${appliedCount} migration(s)`);
    }
  } finally {
    client.release();
  }
}
