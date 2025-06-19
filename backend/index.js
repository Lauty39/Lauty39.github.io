const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a la base de datos SQLite
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
  }
});

// Endpoint de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente' });
});

// Crear usuario (solo admin, para pruebas iniciales)
app.post('/api/users', async (req, res) => {
  const { username, password, role, autorizado } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Faltan datos' });
  const hash = await bcrypt.hash(password, 10);
  db.run(
    'INSERT INTO users (username, password, role, autorizado) VALUES (?, ?, ?, ?)',
    [username, hash, role || 'user', autorizado ? 1 : 0],
    function (err) {
      if (err) return res.status(400).json({ error: 'Usuario ya existe' });
      res.json({ id: this.lastID, username, role: role || 'user', autorizado: !!autorizado });
    }
  );
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    if (!user.autorizado) return res.status(403).json({ error: 'Usuario no autorizado' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role, autorizado: !!user.autorizado } });
  });
});

// Middleware de autenticación
function auth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token requerido' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Middleware para verificar admin
function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Solo el administrador puede realizar esta acción' });
  next();
}

// Listar todos los usuarios (solo admin)
app.get('/api/users', auth, isAdmin, (req, res) => {
  db.all('SELECT id, username, role, autorizado FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener usuarios' });
    res.json(rows);
  });
});

// Editar usuario (solo admin)
app.put('/api/users/:id', auth, isAdmin, async (req, res) => {
  const { username, password, role, autorizado } = req.body;
  const { id } = req.params;
  let query = 'UPDATE users SET username=?, role=?, autorizado=?';
  let params = [username, role, autorizado ? 1 : 0];
  if (password) {
    const hash = await bcrypt.hash(password, 10);
    query += ', password=?';
    params.push(hash);
  }
  query += ' WHERE id=?';
  params.push(id);
  db.run(query, params, function (err) {
    if (err) return res.status(500).json({ error: 'Error al actualizar usuario' });
    if (this.changes === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ id, username, role, autorizado });
  });
});

// Eliminar usuario (solo admin)
app.delete('/api/users/:id', auth, isAdmin, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM users WHERE id=?', [id], function (err) {
    if (err) return res.status(500).json({ error: 'Error al eliminar usuario' });
    if (this.changes === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ success: true });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
}); 