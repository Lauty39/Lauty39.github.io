import React from 'react';

function ExpensesTable({ rows, onUpdateRow, onAddRow, onRemoveRow }) {
  const handleInputChange = (rowIndex, fieldIndex, value) => {
    onUpdateRow(rowIndex, fieldIndex, value);
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Otros Gastos</th>
            <th>Gasto Mensual</th>
            <th>Gasto Diario</th>
            <th>Cantidad de Platos</th>
            <th>Gasto Diario por Plato</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>
                <input
                  type="text"
                  value={row[0] || ''}
                  onChange={(e) => handleInputChange(rowIndex, 0, e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row[1] || ''}
                  onChange={(e) => handleInputChange(rowIndex, 1, e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row[2] || ''}
                  readOnly
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row[3] || ''}
                  onChange={(e) => handleInputChange(rowIndex, 3, e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row[4] || ''}
                  readOnly
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="button">
        <button onClick={onAddRow}>+</button>
        <button onClick={onRemoveRow}>-</button>
      </div>
    </>
  );
}

export default ExpensesTable;
