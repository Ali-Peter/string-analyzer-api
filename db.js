import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const db = new Database(process.env.DATABASE_NAME || "string_analyzer.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS strings (
    id TEXT PRIMARY KEY,
    value TEXT UNIQUE,
    length INTEGER,
    is_palindrome BOOLEAN,
    unique_characters INTEGER,
    word_count INTEGER,
    sha256_hash TEXT,
    character_frequency_map TEXT,
    created_at TEXT
  )
`).run();

export default db;
