import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "..", "eventify.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'User',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    starts_at TEXT NOT NULL, -- ISO string
    price_eur REAL NOT NULL DEFAULT 0,
    image_url TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    revoked_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    target TEXT,
    metadata TEXT,
    ip_address TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Seed some demo events if table is empty (dev UX)
const eventsCount = db.prepare("SELECT COUNT(*) as c FROM events").get()?.c ?? 0;
if (eventsCount === 0) {
  const insert = db.prepare(`
    INSERT INTO events (title, description, category, location, starts_at, price_eur, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const seed = [
    [
      "Tech Conference 2026",
      "Konferencë për teknologji, AI dhe web.",
      "Teknologji",
      "Prishtina, Kosovo",
      "2026-04-15T10:00:00.000Z",
      49.99,
      "https://picsum.photos/id/1015/800/600"
    ],
    [
      "Music Festival Summer",
      "Festival veror me artistë lokalë dhe ndërkombëtarë.",
      "Muzikë",
      "Prizren, Kosovo",
      "2026-06-20T18:00:00.000Z",
      29.99,
      "https://picsum.photos/id/201/800/600"
    ],
    [
      "Kosovo Startup Summit",
      "Takim për startup-e dhe investitorë.",
      "Teknologji",
      "Prishtina, Kosovo",
      "2026-05-10T09:00:00.000Z",
      0,
      "https://picsum.photos/id/301/800/600"
    ],
    [
      "Basketball Final",
      "Finalja e kampionatit, ndeshje me atmosferë të madhe.",
      "Sport",
      "Gjilan, Kosovo",
      "2026-03-30T17:30:00.000Z",
      15,
      "https://picsum.photos/id/401/800/600"
    ]
  ];

  const tx = db.transaction(() => {
    for (const row of seed) insert.run(...row);
  });
  tx();
}

export function createAuditLog({ userId = null, action, target = null, metadata = null, ipAddress = null }) {
  const insert = db.prepare(`
    INSERT INTO audit_logs (user_id, action, target, metadata, ip_address)
    VALUES (?, ?, ?, ?, ?)
  `);

  insert.run(userId, action, target, metadata ? JSON.stringify(metadata) : null, ipAddress);
}

export default db;
