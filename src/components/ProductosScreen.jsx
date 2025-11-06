import React, { useState, useMemo } from 'react';

function ProductosScreen({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'g',
    price: '',
    stock: '',
    supplier: ''
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Ordenar
    filtered = [...filtered].sort((a, b) => {
      let aVal, bVal;
      
      if (sortBy === 'name') {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (sortBy === 'price') {
        aVal = parseFloat(a.price) || 0;
        bVal = parseFloat(b.price) || 0;
      } else if (sortBy === 'stock') {
        aVal = parseFloat(a.stock) || 0;
        bVal = parseFloat(b.stock) || 0;
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [products, searchTerm, sortBy, sortOrder]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.quantity || !formData.price) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    // Si estamos editando, guardar historial de precio si cambió
    if (editingIndex !== null) {
      const oldProduct = products[editingIndex];
      const oldPrice = parseFloat(oldProduct.price) || 0;
      const newPrice = parseFloat(formData.price) || 0;
      
      if (oldPrice !== newPrice && oldPrice > 0) {
        const priceHistory = oldProduct.priceHistory || [];
        priceHistory.push({
          date: new Date().toISOString(),
          price: oldPrice,
          quantity: oldProduct.quantity,
          unit: oldProduct.unit
        });
        formData.priceHistory = priceHistory;
      } else {
        formData.priceHistory = oldProduct.priceHistory || [];
      }
      
      onUpdateProduct(editingIndex, formData);
    } else {
      formData.priceHistory = [];
      onAddProduct(formData);
    }

    setFormData({ name: '', quantity: '', unit: 'g', price: '', stock: '', supplier: '' });
    setEditingIndex(null);
  };

  const handleEdit = (index) => {
    const product = products[index];
    setFormData({
      name: product.name,
      quantity: product.quantity,
      unit: product.unit || 'g',
      price: product.price,
      stock: product.stock || '',
      supplier: product.supplier || ''
    });
    setEditingIndex(index);
  };

  const handleCancel = () => {
    setFormData({ name: '', quantity: '', unit: 'g', price: '', stock: '', supplier: '' });
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      onDeleteProduct(index);
    }
  };

  return (
    <div className="screen active">
      <div className="screen-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2>Gestión de Productos</h2>

        <div style={{ 
          backgroundColor: '#f9f9f9', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginBottom: '2rem' 
        }}>
          <h3>{editingIndex !== null ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid-responsive" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '2fr 1fr 0.8fr 1fr 1fr 1.5fr auto', alignItems: 'end' }}>
              <div>
                <label htmlFor="productName">Nombre del Producto: *</label>
                <input
                  type="text"
                  id="productName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Harina 000"
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label htmlFor="productQuantity">Cantidad: *</label>
                <input
                  type="number"
                  step="0.01"
                  id="productQuantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="Ej: 500"
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label htmlFor="productUnit">Unidad: *</label>
                <select
                  id="productUnit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
                >
                  <option value="g">g (gramos)</option>
                  <option value="kg">kg (kilogramos)</option>
                  <option value="ml">ml (mililitros)</option>
                  <option value="l">l (litros)</option>
                  <option value="un">un (unidades)</option>
                  <option value="pz">pz (piezas)</option>
                </select>
              </div>
              <div>
                <label htmlFor="productPrice">Precio: *</label>
                <input
                  type="number"
                  step="0.01"
                  id="productPrice"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Ej: 3000.00"
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label htmlFor="productStock">Stock Disponible:</label>
                <input
                  type="number"
                  step="0.01"
                  id="productStock"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="Opcional"
                  style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label htmlFor="productSupplier">Proveedor:</label>
                <input
                  type="text"
                  id="productSupplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  placeholder="Ej: Proveedor XYZ"
                  style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
                />
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
          <h3 style={{ margin: 0 }}>Productos Guardados</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', maxWidth: '400px', minWidth: '200px' }}>
              <input
                type="text"
                placeholder="Buscar producto por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div>
              <label>Ordenar: </label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '8px', marginLeft: '8px' }}>
                <option value="name">Nombre</option>
                <option value="price">Precio</option>
                <option value="stock">Stock</option>
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

        {products.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            No hay productos guardados. Agrega tu primer producto arriba.
          </p>
        ) : filteredAndSortedProducts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            No se encontraron productos que coincidan con "{searchTerm}".
          </p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nombre del Producto</th>
                  <th>Cantidad</th>
                  <th>Precio del Producto</th>
                  <th>Precio por Unidad</th>
                  <th>Stock</th>
                  <th>Proveedor</th>
                  <th>Acciones</th>
                </tr>
              </thead>
            <tbody>
              {filteredAndSortedProducts.map((product) => {
                // Encontrar el índice original en el array completo
                const originalIndex = products.findIndex(p => p === product);
                const unitPrice = product.quantity ? (parseFloat(product.price) / parseFloat(product.quantity)).toFixed(2) : 0;
                const stock = product.stock !== null && product.stock !== undefined ? parseFloat(product.stock) : null;
                const stockWarning = stock !== null && stock < 10;
                
                return (
                  <tr key={product.id || originalIndex}>
                    <td>{product.name}</td>
                    <td>{product.quantity} {product.unit || 'g'}</td>
                    <td>${parseFloat(product.price).toFixed(2)}</td>
                    <td>${unitPrice} / {product.unit || 'g'}</td>
                    <td style={{ color: stockWarning ? '#EF4444' : 'inherit', fontWeight: stockWarning ? 'bold' : 'normal' }}>
                      {stock !== null ? `${stock} ${product.unit || 'g'}` : 'N/A'}
                      {stockWarning && ' ⚠️'}
                    </td>
                    <td>{product.supplier || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {product.priceHistory && product.priceHistory.length > 0 && (
                          <button 
                            className="btn-secondary" 
                            onClick={() => {
                              const history = product.priceHistory.map(h => 
                                `${new Date(h.date).toLocaleDateString()}: $${h.price.toFixed(2)}`
                              ).join('\n');
                              alert('Historial de Precios:\n\n' + history);
                            }}
                            title="Ver historial de precios"
                            style={{ padding: '5px 10px', fontSize: '0.875rem' }}
                          >
                            📊
                          </button>
                        )}
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
                      </div>
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

export default ProductosScreen;
