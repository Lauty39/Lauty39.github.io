import React, { useState } from 'react';

function UserManagement({ users, onCreate, onDelete, onEdit, currentUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({ username: '', password: '', role: 'user' });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!username || !password) return alert('Completa todos los campos');
    onCreate({ username, password, role, autorizado: true });
    setUsername('');
    setPassword('');
    setRole('user');
  };

  const startEdit = (i) => {
    setEditIndex(i);
    setEditData({ ...users[i] });
  };

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const saveEdit = (i) => {
    if (!editData.username || !editData.password) return alert('Completa todos los campos');
    onEdit(i, editData);
    setEditIndex(null);
  };

  const cancelEdit = () => {
    setEditIndex(null);
  };

  const handleCheckbox = (i, checked) => {
    onEdit(i, { ...users[i], autorizado: checked });
  };

  return (
    <div className="user-management-container">
      <h2>Gestión de Usuarios</h2>
      <form onSubmit={handleCreate} style={{marginBottom: 20}}>
        <div>
          <label>Usuario:</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Rol:</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button type="submit">Crear Usuario</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Contraseña</th>
            <th>Rol</th>
            <th>Autorizado</th>
            <th>Permitir acceso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i}>
              {editIndex === i ? (
                <>
                  <td><input value={editData.username} onChange={e => handleEditChange('username', e.target.value)} /></td>
                  <td><input value={editData.password} onChange={e => handleEditChange('password', e.target.value)} /></td>
                  <td>
                    <select value={editData.role} onChange={e => handleEditChange('role', e.target.value)}>
                      <option value="user">Usuario</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </td>
                  <td>{editData.autorizado ? 'Sí' : 'No'}</td>
                  <td>
                    <input type="checkbox" checked={!!editData.autorizado} onChange={e => handleEditChange('autorizado', e.target.checked)} />
                  </td>
                  <td>
                    <button onClick={() => saveEdit(i)}>Guardar</button>
                    <button onClick={cancelEdit}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{u.username}</td>
                  <td>{u.password}</td>
                  <td>{u.role}</td>
                  <td>{u.autorizado ? 'Sí' : 'No'}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={!!u.autorizado}
                      onChange={e => handleCheckbox(i, e.target.checked)}
                      disabled={u.username === currentUser}
                    />
                  </td>
                  <td>
                    {u.username !== currentUser && (
                      <>
                        <button onClick={() => startEdit(i)}>Modificar</button>
                        <button onClick={() => onDelete(i)}>Eliminar</button>
                      </>
                    )}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement; 