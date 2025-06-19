import React, { useState, useEffect } from 'react';

const initialCostRow = () => ["", "", "", "", ""];
const initialExpenseRow = () => ["", "", "", "", ""];

function RecipeForm({ onSave, recipeToEdit, readOnly }) {
  const [recipeName, setRecipeName] = useState("");
  const [costRows, setCostRows] = useState([[...initialCostRow()]]);
  const [expenseRows, setExpenseRows] = useState([[...initialExpenseRow()]]);
  const [profit, setProfit] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    if (recipeToEdit) {
      setRecipeName(recipeToEdit.name);
      setCostRows(recipeToEdit.costData.length ? recipeToEdit.costData : [[...initialCostRow()]]);
      setExpenseRows(recipeToEdit.expenseData.length ? recipeToEdit.expenseData : [[...initialExpenseRow()]]);
      setProfit(recipeToEdit.profit);
      setEditingIndex(recipeToEdit.index);
    }
  }, [recipeToEdit]);

  const handleCostChange = (rowIdx, colIdx, value) => {
    const updated = costRows.map((row, i) =>
      i === rowIdx ? row.map((cell, j) => (j === colIdx ? value : cell)) : row
    );
    setCostRows(updated);
  };

  const handleExpenseChange = (rowIdx, colIdx, value) => {
    const updated = expenseRows.map((row, i) =>
      i === rowIdx ? row.map((cell, j) => (j === colIdx ? value : cell)) : row
    );
    setExpenseRows(updated);
  };

  const addRow = (type) => {
    if (type === "cost") setCostRows([...costRows, [...initialCostRow()]]);
    else setExpenseRows([...expenseRows, [...initialExpenseRow()]]);
  };

  const removeRow = (type) => {
    if (type === "cost" && costRows.length > 1) setCostRows(costRows.slice(0, -1));
    if (type === "expense" && expenseRows.length > 1) setExpenseRows(expenseRows.slice(0, -1));
  };

  // Cálculos
  const calculateCost = (row) => {
    const qAdq = parseFloat(row[1]) || 0;
    const price = parseFloat(row[2]) || 0;
    const qUsed = parseFloat(row[3]) || 0;
    return qAdq ? (qUsed * price / qAdq).toFixed(2) : "0";
  };
  const calculateExpense = (row) => {
    const monthly = parseFloat(row[1]) || 0;
    const daily = (monthly / 30).toFixed(2);
    const plates = parseFloat(row[3]) || 0;
    return [daily, plates ? (daily / plates).toFixed(2) : "0"];
  };

  // Totales
  const totalCost = costRows.reduce((acc, row) => acc + (parseFloat(calculateCost(row)) || 0), 0);
  const totalOtherExpenses = expenseRows.reduce((acc, row) => acc + (parseFloat(calculateExpense(row)[1]) || 0), 0);
  const totalAllCosts = totalCost + totalOtherExpenses;
  const totalWithProfit = totalAllCosts * (1 + (parseFloat(profit) || 0) / 100);

  // Guardar receta
  const handleSave = () => {
    if (!recipeName.trim()) return alert("Debe ingresar un nombre de receta");
    const costData = costRows.map(row => [
      row[0], row[1], row[2], row[3], calculateCost(row)
    ]);
    const expenseData = expenseRows.map(row => {
      const [daily, dailyPerPlate] = calculateExpense(row);
      return [row[0], row[1], daily, row[3], dailyPerPlate];
    });
    onSave({
      name: recipeName,
      costData,
      expenseData,
      profit,
      index: editingIndex
    });
    setRecipeName("");
    setCostRows([[...initialCostRow()]]);
    setExpenseRows([[...initialExpenseRow()]]);
    setProfit("");
    setEditingIndex(null);
  };

  const handleReset = () => {
    setRecipeName("");
    setCostRows([[...initialCostRow()]]);
    setExpenseRows([[...initialExpenseRow()]]);
    setProfit("");
    setEditingIndex(null);
  };

  return (
    <div>
      <h1>Software de Costos</h1>
      <div className="input-container recipe-name-container">
        <label>Nombre de la Receta: </label>
        <input type="text" value={recipeName} onChange={e => setRecipeName(e.target.value)} placeholder="Ej: Medialunas" readOnly={readOnly} />
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre del Producto</th>
            <th>Cantidad Adquirida</th>
            <th>Precio del Producto</th>
            <th>Cantidad Utilizada</th>
            <th>Costo</th>
          </tr>
        </thead>
        <tbody>
          {costRows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>
                  {j === 4 ? (
                    <input
                      type="number"
                      value={calculateCost(row)}
                      readOnly
                    />
                  ) : (
                    <input
                      type={j === 0 ? "text" : "number"}
                      value={cell}
                      onChange={e => handleCostChange(i, j, e.target.value)}
                      readOnly={readOnly}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!readOnly && (
        <div className="button">
          <button type="button" onClick={() => addRow("cost")}>+</button>
          <button type="button" onClick={() => removeRow("cost")}>-</button>
        </div>
      )}
      <div className="button">
        <p>Total de Costos: <span>{totalCost.toFixed(2)}</span></p>
      </div>
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
          {expenseRows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>
                  {j === 2 ? (
                    <input
                      type="number"
                      value={calculateExpense(row)[0]}
                      readOnly
                    />
                  ) : j === 4 ? (
                    <input
                      type="number"
                      value={calculateExpense(row)[1]}
                      readOnly
                    />
                  ) : (
                    <input
                      type={j === 0 ? "text" : "number"}
                      value={cell}
                      onChange={e => handleExpenseChange(i, j, e.target.value)}
                      readOnly={readOnly}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!readOnly && (
        <div className="button">
          <button type="button" onClick={() => addRow("expense")}>+</button>
          <button type="button" onClick={() => removeRow("expense")}>-</button>
        </div>
      )}
      <div className="button">
        <p>Total de Otros Gastos: <span>{totalOtherExpenses.toFixed(2)}</span></p>
      </div>
      <div className="section-divider"></div>
      <div className="button">
        <p>Total General: <span>{totalAllCosts.toFixed(2)}</span></p>
      </div>
      <div className="input-container centered">
        <label>Porcentaje de Ganancia: </label>
        <input type="number" value={profit} onChange={e => setProfit(e.target.value)} placeholder="%" readOnly={readOnly} />
      </div>
      <div className="button">
        <p>Total con Ganancia: <span>{totalWithProfit.toFixed(2)}</span></p>
      </div>
      {!readOnly && (
        <div className="button">
          <button type="button" onClick={handleSave}>Guardar Receta</button>
          <button type="button" onClick={handleReset}>Borrar Todo</button>
        </div>
      )}
    </div>
  );
}

export default RecipeForm; 