const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

db.serialize(() => {
  // Tabla de usuarios
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    autorizado INTEGER NOT NULL DEFAULT 0
  )`);

  // Tabla de recetas
  db.run(`CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    costData TEXT NOT NULL,
    expenseData TEXT NOT NULL,
    profit TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  console.log('Tablas creadas correctamente.');
});

db.close(); 