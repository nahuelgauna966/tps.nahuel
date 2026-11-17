import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
const migrationPath = path.join(projectRoot, 'database', 'migrations', '001_initial_schema.sql');

export function createDatabase(dbPath = path.join(projectRoot, 'storage', 'biblioteca.sqlite')) {
  if (dbPath !== ':memory:') {
    fs.mkdirSync(path.dirname(path.resolve(dbPath)), { recursive: true });
  }
  const db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');
  db.pragma('busy_timeout = 5000');
  db.exec(fs.readFileSync(migrationPath, 'utf8'));
  return db;
}
