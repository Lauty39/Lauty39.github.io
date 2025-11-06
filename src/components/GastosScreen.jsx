import React, { useState, useMemo } from 'react';

function GastosScreen({ expenses, onAddExpense, onUpdateExpense, onDeleteExpense }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    monthlyAmount: '',
    category: '',
    dueDate: '',
    isRecurring: false
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterCategory, setFilterCategory] = useState('');
  
  const expenseCategories = ['Fijos', 'Variables', 'Servicios', 'Alquiler', 'Impuestos', 'Otros'];

  // Filtrar y ordenar gastos
  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses.filter(expense => {
      if (searchTerm && !expense.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (filterCategory && expense.category !== filterCategory) {
        return false;
      }
      return true;
    });

    // Ordenar
    filtered = [...filtered].sort((a, b) => {
      let aVal, bVal;
      
      if (sortBy === 'name') {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (sortBy === 'amount') {
        aVal = parseFloat(a.monthlyAmount) || 0;
        bVal = parseFloat(b.monthlyAmount) || 0;
      } else if (sortBy === 'date') {
        aVal = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        bVal = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [expenses, searchTerm, sortBy, sortOrder, filterCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.monthlyAmount) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (editingIndex !== null) {
      onUpdateExpense(editingIndex, formData);
      alert('Gasto actualizado exitosamente');
    } else {
      onAddExpense(formData);
      alert('Gasto agregado exitosamente');
    }

    setFormData({ name: '', monthlyAmount: '', category: '', dueDate: '', isRecurring: false });
    setEditingIndex(null);
  };

  const handleEdit = (index) => {
    const expense = expenses[index];
    setFormData({
      name: expense.name,
      monthlyAmount: expense.monthlyAmount,
      category: expense.category || '',
      dueDate: expense.dueDate || '',
      isRecurring: expense.isRecurring || false
    });
    setEditingIndex(index);
  };

  const handleCancel = () => {
    setFormData({ name: '', monthlyAmount: '' });
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    if (window.confirm('¿Estás seguro de eliminar este gasto?')) {
      onDeleteExpense(index);
    }
  };

  // Calcular total de gastos mensuales
  const totalMonthlyExpenses = expenses.reduce((sum, expense) => {
    return sum + (parseFloat(expense.monthlyAmount) || 0);
  }, 0);

  return (
    <div className="screen active">
      <div className="screen-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2>Gestión de Gastos</h2>

        <div style={{ 
          backgroundColor: '#f9f9f9', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginBottom: '2rem' 
        }}>
          <h3>{editingIndex !== null ? 'Editar Gasto' : 'Agregar Nuevo Gasto'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid-responsive" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.8fr auto', alignItems: 'end' }}>
              <div>
                <label htmlFor="expenseName">Nombre del Gasto: *</label>
                <input
                  type="text"
                  id="expenseName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Alquiler, Servicios, etc."
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label htmlFor="monthlyAmount">Gasto Mensual: *</label>
                <input
                  type="number"
                  step="0.01"
                  id="monthlyAmount"
                  value={formData.monthlyAmount}
                  onChange={(e) => setFormData({ ...formData, monthlyAmount: e.target.value })}
                  placeholder="Ej: 50000.00"
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label htmlFor="expenseCategory">Categoría:</label>
                <select
                  id="expenseCategory"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
                >
                  <option value="">Sin categoría</option>
                  {expenseCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="dueDate">Fecha de Vencimiento:</label>
                <input
                  type="date"
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  />
                  Recurrente
                </label>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                <button type="submit" className="button" style={{ padding: '8px 20px', whiteSpace: 'nowrap' }}>
                  {editingIndex !== null ? 'Actualizar' : 'Agregar'}
                </button>
                {editingIndex !== null && (
                  <button type="button" onClick={handleCancel} className="button" style={{ padding: '8px 20px', whiteSpace: 'nowrap' }}>
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="search-container" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0 }}>Gastos Guardados</h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9em' }}>
              Total mensual: ${totalMonthlyExpenses.toFixed(2)}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', maxWidth: '400px', minWidth: '200px' }}>
              <input
                type="text"
                placeholder="Buscar gasto por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div>
              <label>Categoría: </label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ padding: '8px', marginLeft: '8px' }}>
                <option value="">Todas</option>
                {expenseCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Ordenar: </label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '8px', marginLeft: '8px' }}>
                <option value="name">Nombre</option>
                <option value="amount">Monto</option>
                <option value="date">Fecha</option>
              </select>
              <button 
                className="btn-secondary" 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                style={{ marginLeft: '8px', padding: '8px 12px' }}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {expenses.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            No hay gastos guardados. Agrega tu primer gasto arriba.
          </p>
        ) : filteredAndSortedExpenses.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            No se encontraron gastos que coincidan con los filtros.
          </p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nombre del Gasto</th>
                  <th>Categoría</th>
                  <th>Gasto Mensual</th>
                  <th>Gasto Diario</th>
                  <th>Fecha Vencimiento</th>
                  <th>Recurrente</th>
                  <th>Acciones</th>
                </tr>
              </thead>
            <tbody>
              {filteredAndSortedExpenses.map((expense) => {
                const originalIndex = expenses.findIndex(e => e === expense);
                const dailyAmount = (parseFloat(expense.monthlyAmount) / 30).toFixed(2);
                const dueDate = expense.dueDate ? new Date(expense.dueDate) : null;
                const isOverdue = dueDate && dueDate < new Date() && !expense.isRecurring;
                
                return (
                  <tr key={expense.id || originalIndex} style={{ background: isOverdue ? '#FEE2E2' : 'inherit' }}>
                    <td>{expense.name}</td>
                    <td>
                      {expense.category && (
                        <span style={{ 
                          background: '#E0E7FF', 
                          color: '#6366F1', 
                          padding: '2px 8px', 
                          borderRadius: '12px', 
                          fontSize: '0.75rem' 
                        }}>
                          {expense.category}
                        </span>
                      )}
                    </td>
                    <td>${parseFloat(expense.monthlyAmount).toFixed(2)}</td>
                    <td>${dailyAmount}</td>
                    <td style={{ color: isOverdue ? '#EF4444' : 'inherit', fontWeight: isOverdue ? 'bold' : 'normal' }}>
                      {dueDate ? dueDate.toLocaleDateString('es-ES') : '-'}
                      {isOverdue && ' ⚠️'}
                    </td>
                    <td>{expense.isRecurring ? '✓' : '-'}</td>
                    <td>
                      <button 
                        onClick={() => handleEdit(originalIndex)}
                        style={{ marginRight: '0.5rem', padding: '5px 10px' }}
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(originalIndex)}
                        style={{ padding: '5px 10px' }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default GastosScreen;

