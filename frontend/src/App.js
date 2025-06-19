import React, { useState, useEffect } from 'react';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import Login from './components/Login';
import Register from './components/Register';
import UserManagement from './components/UserManagement';
import './App.css';
import API_BASE_URL from './utils/api';

// Simulación de usuarios en localStorage (hasta tener backend)
const getUsers = () => JSON.parse(localStorage.getItem('users') || '[]');
const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

function App() {
  const [screen, setScreen] = useState('login');
  const [recipes, setRecipes] = useState([]);
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [viewingRecipe, setViewingRecipe] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(false);
  const [adminEditData, setAdminEditData] = useState({ username: '', password: '', password2: '' });
  const [showRegister, setShowRegister] = useState(false);
  const [usersExist, setUsersExist] = useState(true);

  // Cargar recetas solo del usuario logueado
  useEffect(() => {
    if (user) {
      const allRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
      setRecipes(allRecipes.filter(r => r.user === user.username));
    }
  }, [user]);

  useEffect(() => {
    setUsers(getUsers());
  }, [screen]);

  useEffect(() => {
    // Migración automática: asegurar que todos los admin tengan autorizado=true
    let usersList = getUsers();
    let changed = false;
    usersList = usersList.map(u => {
      if (u.role === 'admin' && !u.autorizado) {
        changed = true;
        return { ...u, autorizado: true };
      }
      return u;
    });
    if (changed) {
      saveUsers(usersList);
    }
    setUsers(usersList);
  }, []);

  // Verificar si existen usuarios en el backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/users-exist`)
      .then(res => res.json())
      .then(data => setUsersExist(data.exist))
      .catch(() => setUsersExist(true));
  }, []);

  // Login simulado
  const handleLogin = ({ username, password }) => {
    const users = getUsers();
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      if (!found.autorizado) {
        alert('El usuario no está autorizado para iniciar sesión');
        return;
      }
      setUser(found);
      setScreen('main');
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  const handleRegister = ({ username, password }) => {
    fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) return alert(data.error);
        alert('Usuario registrado correctamente');
        setShowRegister(false);
        setUsersExist(true);
      });
  };

  // Guardar receta asociada al usuario
  const saveRecipe = (recipe) => {
    let allRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    if (recipe.index !== undefined && recipe.index !== null) {
      // Solo puede editar sus propias recetas
      const idx = allRecipes.findIndex((r, i) => r.user === user.username && i === recipe.index);
      if (idx !== -1) allRecipes[idx] = { ...recipe, user: user.username };
    } else {
      allRecipes.push({ ...recipe, user: user.username });
    }
    localStorage.setItem('recipes', JSON.stringify(allRecipes));
    setRecipes(allRecipes.filter(r => r.user === user.username));
    setScreen('list');
    setRecipeToEdit(null);
  };

  const handleView = (i) => {
    setRecipeToEdit({ ...recipes[i], index: i });
    setViewingRecipe(i);
    setScreen('view');
    setIsEditing(false);
  };

  const handleEditRecipe = () => {
    setIsEditing(true);
    setScreen('main');
  };

  const handleBackToList = () => {
    setViewingRecipe(null);
    setRecipeToEdit(null);
    setScreen('list');
    setIsEditing(false);
  };

  const handleDeleteRecipe = (i) => {
    if (!window.confirm('¿Eliminar esta receta?')) return;
    let allRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    const filtered = allRecipes.filter((r, idx) => !(r.user === user.username && idx === i));
    localStorage.setItem('recipes', JSON.stringify(filtered));
    setRecipes(filtered.filter(r => r.user === user.username));
    handleBackToList();
  };

  const handleLogout = () => {
    setUser(null);
    setScreen('login');
    setRecipeToEdit(null);
  };

  // Gestión de usuarios (solo admin)
  const handleCreateUser = ({ username, password, role, autorizado }) => {
    let usersList = getUsers();
    // Si es el primer usuario (admin), autorizado siempre true
    const isFirstUser = usersList.length === 0 && role === 'admin';
    if (usersList.find(u => u.username === username)) {
      alert('El usuario ya existe');
      return;
    }
    usersList.push({ username, password, role, autorizado: autorizado !== undefined ? autorizado : isFirstUser ? true : false });
    saveUsers(usersList);
    setUsers(usersList);
    alert('Usuario creado correctamente');
  };

  const handleDeleteUser = (i) => {
    let usersList = getUsers();
    const userToDelete = usersList[i];
    if (userToDelete.username === user.username) {
      alert('No puedes eliminar tu propio usuario mientras estás logueado.');
      return;
    }
    if (!window.confirm('¿Eliminar este usuario?')) return;
    usersList.splice(i, 1);
    saveUsers(usersList);
    setUsers(usersList);
  };

  // Modificar usuario (solo admin)
  const handleEditUser = (i, newData) => {
    let usersList = getUsers();
    usersList[i] = { ...usersList[i], ...newData };
    saveUsers(usersList);
    setUsers(usersList);
    alert('Usuario modificado correctamente');
  };

  const handleEditAdmin = () => {
    setAdminEditData({ username: user.username, password: '', password2: '' });
    setEditingAdmin(true);
  };

  const handleAdminEditChange = (field, value) => {
    setAdminEditData({ ...adminEditData, [field]: value });
  };

  const handleSaveAdminEdit = () => {
    if (!adminEditData.username) return alert('El usuario no puede estar vacío');
    if (adminEditData.password && adminEditData.password !== adminEditData.password2) return alert('Las contraseñas no coinciden');
    let usersList = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = usersList.findIndex(u => u.username === user.username);
    if (idx === -1) return alert('Error interno');
    usersList[idx].username = adminEditData.username;
    if (adminEditData.password) usersList[idx].password = adminEditData.password;
    localStorage.setItem('users', JSON.stringify(usersList));
    setUser({ ...user, username: adminEditData.username });
    setEditingAdmin(false);
    alert('Datos actualizados');
  };

  const handleCancelAdminEdit = () => {
    setEditingAdmin(false);
  };

  return (
    <div className="App">
      {!user && !usersExist && showRegister && (
        <Register onRegister={handleRegister} onSwitchToLogin={() => setShowRegister(false)} />
      )}
      {!user && (usersExist || !showRegister) && (
        <Login onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} showRegister={!usersExist} />
      )}
      {user && (
        <>
          <div className="button" style={{ textAlign: 'right' }}>
            <span>Usuario: <b>{user.username}</b></span>
            <button onClick={handleLogout}>Cerrar sesión</button>
            {user.role === 'admin' && (
              <>
                <button onClick={() => setScreen('users')}>Gestión de Usuarios</button>
                <button onClick={handleEditAdmin}>Modificar mis datos</button>
              </>
            )}
          </div>
          {editingAdmin && (
            <div className="user-management-container" style={{ maxWidth: 400, margin: '40px auto' }}>
              <h2>Modificar mis datos</h2>
              <div>
                <label>Usuario:</label>
                <input type="text" value={adminEditData.username} onChange={e => handleAdminEditChange('username', e.target.value)} />
              </div>
              <div>
                <label>Nueva contraseña:</label>
                <input type="password" value={adminEditData.password} onChange={e => handleAdminEditChange('password', e.target.value)} />
              </div>
              <div>
                <label>Repetir contraseña:</label>
                <input type="password" value={adminEditData.password2} onChange={e => handleAdminEditChange('password2', e.target.value)} />
              </div>
              <div className="button">
                <button onClick={handleSaveAdminEdit}>Guardar</button>
                <button onClick={handleCancelAdminEdit}>Cancelar</button>
              </div>
            </div>
          )}
          {screen === 'main' && (
            <>
              <RecipeForm onSave={saveRecipe} recipeToEdit={recipeToEdit} />
              <div className="button">
                <button onClick={() => setScreen('list')}>Ver Recetas</button>
              </div>
            </>
          )}
          {screen === 'list' && (
            <>
              <RecipeList recipes={recipes} onView={handleView} onDelete={handleDeleteRecipe} />
              <div className="button">
                <button onClick={() => setScreen('main')}>Volver</button>
              </div>
            </>
          )}
          {screen === 'view' && viewingRecipe !== null && (
            <>
              <RecipeForm
                onSave={saveRecipe}
                recipeToEdit={{ ...recipes[viewingRecipe], index: viewingRecipe }}
                readOnly={!isEditing}
              />
              <div className="button">
                {!isEditing && <>
                  <button onClick={handleEditRecipe}>Editar</button>
                  <button onClick={() => handleDeleteRecipe(viewingRecipe)}>Eliminar</button>
                </>}
                <button onClick={handleBackToList}>Volver a la lista</button>
              </div>
            </>
          )}
          {user.role === 'admin' && screen === 'users' && (
            <>
              <UserManagement
                users={users}
                onCreate={handleCreateUser}
                onDelete={handleDeleteUser}
                onEdit={handleEditUser}
                currentUser={user.username}
              />
              <div className="button">
                <button onClick={() => setScreen('main')}>Volver</button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
