import React from 'react';
import { convertUnit, canConvert, getUnitType } from '../utils/unitConverter';

function CostTable({ rows, products, onUpdateRow, onAddRow, onRemoveRow }) {
  const handleInputChange = (rowIndex, field, value) => {
    onUpdateRow(rowIndex, field, value);
  };

  const handleProductChange = (rowIndex, productId) => {
    onUpdateRow(rowIndex, 'productId', productId);
  };

  const handleUnitConversion = (rowIndex, targetUnit) => {
    const row = rows[rowIndex];
    const product = products.find(p => p.id === row.productId);
    if (!product || !row.quantityUsed) return;

    const currentUnit = product.unit || 'g';
    if (canConvert(currentUnit, targetUnit)) {
      const converted = convertUnit(row.quantityUsed, currentUnit, targetUnit);
      onUpdateRow(rowIndex, 'quantityUsed', converted);
    }
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad Adquirida</th>
            <th>Precio del Producto</th>
            <th>Cantidad Utilizada</th>
            <th>Costo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const product = products.find(p => p.id === row.productId);
            const quantityAcquired = product ? parseFloat(product.quantity) : 0;
            const productPrice = product ? parseFloat(product.price) : 0;
            const quantityUsed = parseFloat(row.quantityUsed) || 0;
            const cost = quantityAcquired ? (quantityUsed * productPrice / quantityAcquired).toFixed(2) : 0;

            return (
              <tr key={rowIndex}>
                <td>
                  <select
                    value={row.productId || ''}
                    onChange={(e) => handleProductChange(rowIndex, e.target.value)}
                    style={{ width: '100%', padding: '8px' }}
                  >
                    <option value="">Seleccionar producto...</option>
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                    <input
                      type="number"
                      value={quantityAcquired}
                      readOnly
                      style={{ backgroundColor: '#eee', flex: '1', minWidth: '60px' }}
                    />
                    <span style={{ fontSize: '0.9em', color: '#666', whiteSpace: 'nowrap' }}>
                      {product ? (product.unit || 'g') : ''}
                    </span>
                  </div>
                </td>
                <td>
                  <input
                    type="number"
                    value={productPrice}
                    readOnly
                    style={{ backgroundColor: '#eee' }}
                  />
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                    <input
                      type="number"
                      value={row.quantityUsed || ''}
                      onChange={(e) => handleInputChange(rowIndex, 'quantityUsed', e.target.value)}
                      step="0.01"
                      placeholder="0"
                      style={{ flex: 1, minWidth: '80px' }}
                      aria-label={`Cantidad utilizada fila ${rowIndex + 1}`}
                    />
                    <span style={{ fontSize: '0.9em', color: '#666', whiteSpace: 'nowrap' }}>
                      {product ? (product.unit || 'g') : ''}
                    </span>
                    {product && product.unit && (
                      <select
                        onChange={(e) => handleUnitConversion(rowIndex, e.target.value)}
                        value={product.unit}
                        style={{ fontSize: '0.75rem', padding: '4px' }}
                        title="Convertir unidad"
                        aria-label="Convertir unidad"
                      >
                        {(product.unit === 'g' || product.unit === 'kg' || product.unit === 'mg') && (
                          <>
                            <option value="g">g</option>
                            <option value="kg">kg</option>
                            <option value="mg">mg</option>
                          </>
                        )}
                        {(product.unit === 'ml' || product.unit === 'l' || product.unit === 'cl') && (
                          <>
                            <option value="ml">ml</option>
                            <option value="l">l</option>
                            <option value="cl">cl</option>
                          </>
                        )}
                        {(product.unit === 'un' || product.unit === 'pz') && (
                          <>
                            <option value="un">un</option>
                            <option value="pz">pz</option>
                          </>
                        )}
                      </select>
                    )}
                  </div>
                </td>
                <td>
                  <input
                    type="number"
                    value={cost}
                    readOnly
                    style={{ backgroundColor: '#eee' }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="button">
        <button onClick={onAddRow}>+</button>
        <button onClick={onRemoveRow}>-</button>
      </div>
    </>
  );
}

export default CostTable;