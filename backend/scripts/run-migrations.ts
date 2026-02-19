import { runMigrations } from "../src/db/migration.ts";

runMigrations()
  .then(() => {
    console.log("Migrations completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
