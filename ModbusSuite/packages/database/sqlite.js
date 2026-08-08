import fs from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";

let database;

function getDatabase() {
  if (!database) {
    throw new Error("SQLite has not been initialized");
  }

  return database;
}

export function initializeDatabase(userDataPath) {
  if (database) {
    return;
  }

  fs.mkdirSync(userDataPath, { recursive: true });

  const databasePath = path.join(userDataPath, "modbus-dashboard.sqlite");
  database = new DatabaseSync(databasePath);

  database.exec(`
    CREATE TABLE IF NOT EXISTS app_storage (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  console.log("[Database] SQLite initialized", { databasePath });
}

export function getAllStorage() {
  const rows = getDatabase()
    .prepare("SELECT key, value FROM app_storage")
    .all();

  return Object.fromEntries(rows.map(({ key, value }) => [key, value]));
}

export function setStorageValue(key, value) {
  getDatabase()
    .prepare(`
      INSERT INTO app_storage (key, value, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = excluded.updated_at
    `)
    .run(key, value, Date.now());
}

export function removeStorageValue(key) {
  getDatabase()
    .prepare("DELETE FROM app_storage WHERE key = ?")
    .run(key);
}

export function clearStorage() {
  getDatabase().exec("DELETE FROM app_storage");
}

export function closeDatabase() {
  if (database) {
    database.close();
    database = undefined;
  }
}
