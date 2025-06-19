import React, { useState, useEffect } from 'react';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import Login from './components/Login';
// import Register from './components/Register';
import UserManagement from './components/UserManagement';
import './App.css';

const API_URL = "https://lauty39-github-io.onrender.com";

const apiFetch = (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(`${API_URL}${url}`, { ...options, headers });
};

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
    const checkUser = () => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if(storedUser && token){
            setUser(JSON.parse(storedUser));
            setScreen('main');
        }
    }
    checkUser();
  }, [])

  useEffect(() => {
    if (user && user.role === 'admin' && screen === 'users') {
      loadUsers();
    }
    if (user && (screen === 'list' || screen === 'main')) {
      loadRecipes();
    }
  }, [user, screen]);

  const loadUsers = async () => {
    try {
      const res = await apiFetch('/api/users');
      if (!res.ok) throw new Error('Error al cargar usuarios');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const loadRecipes = async () => {
    try {
        const res = await apiFetch('/api/recipes');
        if(!res.ok) throw new Error('Error al cargar recetas');
        const data = await res.json();
        setRecipes(data);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const res = await apiFetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error de login');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setScreen('main');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const saveRecipe = async (recipe) => {
    try {
        const url = recipe.id ? `/api/recipes/${recipe.id}` : '/api/recipes';
        const method = recipe.id ? 'PUT' : 'POST';

        const res = await apiFetch(url, {
            method,
            body: JSON.stringify(recipe)
        });

        if(!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Error al guardar receta');
        }
        
        await loadRecipes();
        setScreen('list');
        setRecipeToEdit(null);

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
  };

  const handleView = (recipe) => {
    setRecipeToEdit(recipe);
    setViewingRecipe(recipe);
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

  const handleDeleteRecipe = async (id) => {
    if (!window.confirm('¿Eliminar esta receta?')) return;
    try {
        const res = await apiFetch(`/api/recipes/${id}`, { method: 'DELETE' });
        if(!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Error al eliminar receta');
        }
        await loadRecipes();
        handleBackToList();
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setScreen('login');
    setRecipeToEdit(null);
  };

  const handleCreateUser = async ({ username, password, role }) => {
    try {
        const res = await apiFetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({ username, password, role, autorizado: true })
        });
        const data = await res.json();
        if(!res.ok) throw new Error(data.error || 'Error al crear usuario');
        await loadUsers();
        alert('Usuario creado correctamente');
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try {
        const res = await apiFetch(`/api/users/${id}`, { method: 'DELETE' });
        if(!res.ok) throw new Error((await res.json()).error);
        await loadUsers();
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
  };

  const handleEditUser = async (userToEdit) => {
    try {
        const { id, ...userData } = userToEdit;
        const res = await apiFetch(`/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
        if(!res.ok) throw new Error((await res.json()).error);
        await loadUsers();
        alert('Usuario modificado correctamente');
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
  };

  const handleEditAdmin = () => {
    setAdminEditData({ username: user.username, password: '', password2: '' });
    setEditingAdmin(true);
  };

  const handleAdminEditChange = (field, value) => {
    setAdminEditData({ ...adminEditData, [field]: value });
  };

  const handleSaveAdminEdit = async () => {
    if (!adminEditData.username) return alert('El usuario no puede estar vacío');
    if (adminEditData.password && adminEditData.password !== adminEditData.password2) return alert('Las contraseñas no coinciden');
    
    try {
        const payload = {
            username: adminEditData.username,
            role: user.role,
            autorizado: user.autorizado
        };
        if(adminEditData.password) payload.password = adminEditData.password;

        const res = await apiFetch(`/api/users/${user.id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        if(!res.ok) throw new Error((await res.json()).error);

        const updatedUser = { ...user, username: adminEditData.username };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditingAdmin(false);
        alert('Datos actualizados');

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
  };

  const handleCancelAdminEdit = () => {
    setEditingAdmin(false);
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
                <button onClick={() => setScreen('users')}>Gestión de Usuarios</button>
                <button onClick={handleEditAdmin}>Modificar mis datos</button>
              </>
            )}
          </div>

          {editingAdmin && (
            <div className="user-management-container" style={{ maxWidth: 400, margin: '40px auto' }}>
              <h2>Modificar mis datos</h2>
              <div><label>Usuario:</label><input type="text" value={adminEditData.username} onChange={e => handleAdminEditChange('username', e.target.value)} /></div>
              <div><label>Nueva contraseña:</label><input type="password" value={adminEditData.password} onChange={e => handleAdminEditChange('password', e.target.value)} /></div>
              <div><label>Repetir contraseña:</label><input type="password" value={adminEditData.password2} onChange={e => handleAdminEditChange('password2', e.target.value)} /></div>
              <div className="button"><button onClick={handleSaveAdminEdit}>Guardar</button><button onClick={handleCancelAdminEdit}>Cancelar</button></div>
            </div>
          )}

          {!editingAdmin && screen === 'main' && (
            <>
              <RecipeForm onSave={saveRecipe} recipeToEdit={recipeToEdit} readOnly={isEditing ? false : recipeToEdit !== null} />
               <div className="button">
                <button onClick={() => { setRecipeToEdit(null); setScreen('list')}}>Ver Recetas</button>
              </div>
            </>
          )}

          {!editingAdmin && screen === 'list' && (
            <>
              <RecipeList recipes={recipes} onView={handleView} onDelete={(id) => handleDeleteRecipe(id)} />
              <div className="button">
                <button onClick={() => { setRecipeToEdit(null); setIsEditing(false); setScreen('main'); }}>Crear Nueva Receta</button>
              </div>
            </>
          )}

          {!editingAdmin && screen === 'view' && viewingRecipe && (
            <>
              <RecipeForm
                onSave={saveRecipe}
                recipeToEdit={recipeToEdit}
                readOnly={!isEditing}
              />
              <div className="button">
                {isEditing ? (
                     <button onClick={() => saveRecipe(recipeToEdit)}>Guardar Cambios</button>
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
