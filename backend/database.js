const Database = require('better-sqlite3');
const db = new Database('recipes.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt TEXT
  );

  CREATE TABLE IF NOT EXISTS recipes (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    title TEXT NOT NULL,
    cuisine TEXT DEFAULT '',
    diet TEXT DEFAULT '',
    time INTEGER DEFAULT 0,
    servings INTEGER DEFAULT 1,
    imageUrl TEXT DEFAULT '',
    createdAt TEXT,
    updatedAt TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS ingredients (
    id TEXT PRIMARY KEY,
    recipeId TEXT NOT NULL,
    name TEXT NOT NULL,
    amount TEXT DEFAULT '',
    unit TEXT DEFAULT '',
    FOREIGN KEY (recipeId) REFERENCES recipes(id)
  );

  CREATE TABLE IF NOT EXISTS steps (
    id TEXT PRIMARY KEY,
    recipeId TEXT NOT NULL,
    stepOrder INTEGER NOT NULL,
    instruction TEXT NOT NULL,
    FOREIGN KEY (recipeId) REFERENCES recipes(id)
  );
`);

console.log('Database ready: recipes.db');
module.exports = db;