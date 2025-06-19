import React, { useState, useEffect } from 'react';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import './App.css';

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

  useEffect(() => {
    let usersList = getUsers();
    let changed = false;
    usersList = usersList.map(u => {
        if (u.role === 'admin' && u.autorizado === undefined) {
            changed = true;
            return { ...u, autorizado: true };
        }
        return u;
    });
    if (changed) saveUsers(usersList);
    setUsers(usersList);
  }, []);

  useEffect(() => {
    if (user) {
      const allRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
      setRecipes(allRecipes.filter(r => r.user === user.username));
    }
  }, [user]);
  
  const handleLogin = ({ username, password }) => {
    const usersList = getUsers();
    const found = usersList.find(u => u.username === username && u.password === password);
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

  const handleLogout = () => {
    setUser(null);
    setScreen('login');
  };

  const saveRecipe = (recipe) => {
    let allRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    if (recipe.id) { // Edición
      const index = allRecipes.findIndex(r => r.id === recipe.id && r.user === user.username);
      if (index !== -1) {
        allRecipes[index] = recipe;
      }
    } else { // Creación
      const newRecipe = { ...recipe, id: Date.now(), user: user.username };
      allRecipes.push(newRecipe);
    }
    localStorage.setItem('recipes', JSON.stringify(allRecipes));
    setRecipes(allRecipes.filter(r => r.user === user.username));
    setScreen('list');
    setRecipeToEdit(null);
    setIsEditing(false);
  };
  
  const handleView = (recipe) => {
    setRecipeToEdit(recipe);
    setViewingRecipe(recipe);
    setScreen('view');
    setIsEditing(false);
  };

  const handleBackToList = () => {
    setViewingRecipe(null);
    setRecipeToEdit(null);
    setScreen('list');
  };
  
  const handleDeleteRecipe = (id) => {
    if (!window.confirm('¿Eliminar esta receta?')) return;
    let allRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    const filtered = allRecipes.filter(r => !(r.id === id && r.user === user.username));
    localStorage.setItem('recipes', JSON.stringify(filtered));
    setRecipes(filtered.filter(r => r.user === user.username));
    handleBackToList();
  };

  const handleCreateUser = ({ username, password, role }) => {
    let usersList = getUsers();
    if (usersList.find(u => u.username === username)) {
      return alert('El usuario ya existe');
    }
    const isFirstUser = usersList.length === 0;
    const newUser = { 
        username, 
        password, 
        role: isFirstUser ? 'admin' : role, 
        autorizado: isFirstUser, 
        id: Date.now() 
    };
    usersList.push(newUser);
    saveUsers(usersList);
    setUsers(usersList);
    alert('Usuario creado correctamente');
  };
  
  const handleEditUser = (editedUser) => {
    let usersList = getUsers();
    const index = usersList.findIndex(u => u.id === editedUser.id);
    if (index !== -1) {
      usersList[index] = editedUser;
      saveUsers(usersList);
      setUsers(usersList);
      alert('Usuario modificado correctamente');
    }
  };

  const handleDeleteUser = (id) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    let usersList = getUsers();
    usersList = usersList.filter(u => u.id !== id);
    saveUsers(usersList);
    setUsers(usersList);
  };
  
  const handleEditAdmin = () => {
    setAdminEditData({ username: user.username, password: '', password2: '' });
    setEditingAdmin(true);
  };

  const handleSaveAdminEdit = () => {
    if (!adminEditData.username) return alert('El usuario no puede estar vacío');
    if (adminEditData.password && adminEditData.password !== adminEditData.password2) return alert('Las contraseñas no coinciden');
    
    let usersList = getUsers();
    const index = usersList.findIndex(u => u.id === user.id);
    if (index !== -1) {
      const updatedUser = { ...usersList[index], username: adminEditData.username };
      if (adminEditData.password) {
        updatedUser.password = adminEditData.password;
      }
      usersList[index] = updatedUser;
      saveUsers(usersList);
      setUser(updatedUser);
      setEditingAdmin(false);
      alert('Datos actualizados');
    }
  };

  return (
    <div className="App">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <div className="button" style={{ textAlign: 'right' }}>
            <span>Usuario: <b>{user.username}</b></span>
            <button onClick={handleLogout}>Cerrar sesión</button>
            {user.role === 'admin' && (
              <>
                <button onClick={() => { setUsers(getUsers()); setScreen('users'); }}>Gestión de Usuarios</button>
                <button onClick={handleEditAdmin}>Modificar mis datos</button>
              </>
            )}
          </div>

          {editingAdmin && (
             <div className="user-management-container" style={{ maxWidth: 400, margin: '40px auto' }}>
                <h2>Modificar mis datos</h2>
                <div><label>Usuario:</label><input type="text" value={adminEditData.username} onChange={e => setAdminEditData({...adminEditData, username: e.target.value})} /></div>
                <div><label>Nueva contraseña:</label><input type="password" value={adminEditData.password} onChange={e => setAdminEditData({...adminEditData, password: e.target.value})} /></div>
                <div><label>Repetir contraseña:</label><input type="password" value={adminEditData.password2} onChange={e => setAdminEditData({...adminEditData, password2: e.target.value})} /></div>
                <div className="button"><button onClick={handleSaveAdminEdit}>Guardar</button><button onClick={() => setEditingAdmin(false)}>Cancelar</button></div>
             </div>
          )}

          {!editingAdmin && screen === 'main' && (
            <>
              <RecipeForm onSave={saveRecipe} recipeToEdit={recipeToEdit} readOnly={false} />
              <div className="button"><button onClick={() => setScreen('list')}>Ver Recetas</button></div>
            </>
          )}
          
          {!editingAdmin && screen === 'list' && (
            <>
              <RecipeList recipes={recipes} onView={handleView} onDelete={handleDeleteRecipe} />
              <div className="button"><button onClick={() => { setRecipeToEdit(null); setScreen('main'); }}>Crear Nueva Receta</button></div>
            </>
          )}

          {!editingAdmin && screen === 'view' && viewingRecipe && (
            <>
              <RecipeForm onSave={saveRecipe} recipeToEdit={recipeToEdit} readOnly={!isEditing} />
              <div className="button">
                {isEditing ? (
                  <button onClick={() => {const form = document.querySelector('form'); saveRecipe(recipeToEdit)}}>Guardar Cambios</button>
                ) : (
                  <button onClick={() => setIsEditing(true)}>Editar</button>
                )}
                <button onClick={() => handleDeleteRecipe(viewingRecipe.id)}>Eliminar</button>
                <button onClick={handleBackToList}>Volver a la lista</button>
              </div>
            </>
          )}

          {!editingAdmin && user.role === 'admin' && screen === 'users' && (
            <>
              <UserManagement users={users} onCreate={handleCreateUser} onDelete={handleDeleteUser} onEdit={handleEditUser} currentUser={user.username} />
              <div className="button"><button onClick={() => setScreen('main')}>Volver</button></div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
