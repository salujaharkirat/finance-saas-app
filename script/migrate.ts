// index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import {config} from "dotenv";

config({ path: ".env.local"});

const db = drizzle(process.env.DATABASE_URL!);

const migrateToLatest = async () => {
  await migrate(db, { migrationsFolder: "migrations"});
}

migrateToLatest();
