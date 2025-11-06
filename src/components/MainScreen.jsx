import React, { useState, useEffect } from 'react';
import CostTable from './CostTable';

function MainScreen({
  recipeName,
  onRecipeNameChange,
  costRows,
  products,
  onCostRowUpdate,
  onCostRowAdd,
  onCostRowRemove,
  totalCost,
  totalExpenses,
  totalAllCosts,
  expensesPercentage,
  onExpensesPercentageChange,
  profitPercentage,
  onProfitPercentageChange,
  totalWithProfit,
  onSaveRecipe,
  onReset,
  isEditing,
  // Nuevas props
  category: recipeCategory = '',
  onCategoryChange,
  tags: recipeTags = [],
  onTagsChange,
  notes: recipeNotes = '',
  onNotesChange,
  portions: recipePortions = 1,
  onPortionsChange,
  image: recipeImage = null,
  onImageChange,
  additionalCosts = { labor: '', packaging: '', transport: '' },
  onAdditionalCostsChange,
  profitLevels = { minimum: '', target: '', maximum: '' },
  onProfitLevelsChange,
  sellingUnit = '',
  onSellingUnitChange
}) {
  const [newTag, setNewTag] = useState('');
  
  // Categorías predefinidas
  const categories = ['Postres', 'Panadería', 'Bebidas', 'Platos Principales', 'Aperitivos', 'Otros'];
  // Unidades de medida de venta
  const sellingUnits = ['Docena/Unidad', 'Kilogramo', 'Unidad', 'Otro'];
  const handleAddTag = () => {
    if (newTag.trim() && !recipeTags.includes(newTag.trim())) {
      onTagsChange([...recipeTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onTagsChange(recipeTags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calcular totales con costos adicionales
  const additionalCostsTotal = (parseFloat(additionalCosts.labor) || 0) + 
                                (parseFloat(additionalCosts.packaging) || 0) + 
                                (parseFloat(additionalCosts.transport) || 0);
  
  const totalWithAdditional = totalAllCosts + additionalCostsTotal;
  const portions = parseFloat(recipePortions) || 1;
  const costPerPortion = totalWithAdditional / portions;
  
  // Calcular con diferentes niveles de ganancia
  const profitMin = parseFloat(profitLevels.minimum) || parseFloat(profitPercentage) || 0;
  const profitTarget = parseFloat(profitLevels.target) || parseFloat(profitPercentage) || 0;
  const profitMax = parseFloat(profitLevels.maximum) || parseFloat(profitPercentage) || 0;
  
  const totalWithProfitMin = totalWithAdditional * (1 + profitMin / 100);
  const totalWithProfitTarget = totalWithAdditional * (1 + profitTarget / 100);
  const totalWithProfitMax = totalWithAdditional * (1 + profitMax / 100);

  return (
    <div className="screen active" style={{ paddingBottom: '2rem' }}>
      <div className="screen-container">
      <h2 style={{ marginTop: '0', marginBottom: '2rem' }}>Crear Nueva Receta</h2>
      <div className="input-container recipe-name-container">
        <label htmlFor="recipeName">Nombre de la Receta: </label>
        <input
          type="text"
          id="recipeName"
          placeholder="Ej: Medialunas"
          value={recipeName}
          onChange={(e) => onRecipeNameChange(e.target.value)}
        />
      </div>

      {/* Categoría */}
      <div className="input-container" style={{ marginTop: '1rem' }}>
        <label htmlFor="recipeCategory">Categoría: </label>
        <select
          id="recipeCategory"
          value={recipeCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          style={{ width: '100%', maxWidth: '300px' }}
        >
          <option value="">Sin categoría</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div className="input-container" style={{ marginTop: '1rem' }}>
        <label>Etiquetas: </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {recipeTags.map((tag, i) => (
            <span key={i} style={{ 
              background: '#E0E7FF', 
              color: '#6366F1', 
              padding: '4px 12px', 
              borderRadius: '16px', 
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              #{tag}
              <button 
                type="button"
                onClick={() => handleRemoveTag(tag)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  color: '#6366F1',
                  fontSize: '1.2rem',
                  padding: 0,
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Agregar etiqueta..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            style={{ padding: '8px', width: '150px' }}
          />
          <button type="button" className="btn-secondary" onClick={handleAddTag} style={{ padding: '8px 16px' }}>
            Agregar
          </button>
        </div>
      </div>

      {/* Porciones */}
      <div className="input-container" style={{ marginTop: '1rem' }}>
        <label htmlFor="recipePortions">Cantidad de Porciones: </label>
        <input
          type="number"
          id="recipePortions"
          min="1"
          value={recipePortions}
          onChange={(e) => onPortionsChange(e.target.value)}
          style={{ width: '100px' }}
        />
      </div>

      {/* Unidad de medida de venta */}
      <div className="input-container" style={{ marginTop: '1rem' }}>
        <label htmlFor="sellingUnit">Unidad de Medida (Cómo se vende): </label>
        <select
          id="sellingUnit"
          value={sellingUnit}
          onChange={(e) => onSellingUnitChange(e.target.value)}
          style={{ width: '100%', maxWidth: '300px', padding: '8px' }}
        >
          <option value="">Seleccionar unidad...</option>
          {sellingUnits.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </div>

      {/* Imagen */}
      <div className="input-container" style={{ marginTop: '1rem' }}>
        <label htmlFor="recipeImage">Imagen de la Receta: </label>
        <input
          type="file"
          id="recipeImage"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ padding: '8px' }}
        />
        {recipeImage && (
          <div style={{ marginTop: '10px' }}>
            <img 
              src={recipeImage} 
              alt="Preview" 
              style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }}
            />
            <button 
              type="button"
              className="btn-secondary" 
              onClick={() => onImageChange(null)}
              style={{ marginLeft: '10px', padding: '8px 16px' }}
            >
              Eliminar
            </button>
          </div>
        )}
      </div>

      <div className="section-divider"></div>

      <div className="table-wrapper">
        <CostTable
          rows={costRows}
          products={products}
          onUpdateRow={onCostRowUpdate}
          onAddRow={onCostRowAdd}
          onRemoveRow={onCostRowRemove}
        />
      </div>
      <div className="button">
        <p>Total de Costos de Productos: <span>${totalCost.toFixed(2)}</span></p>
      </div>

      {/* Costos adicionales */}
      <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Costos Adicionales</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label htmlFor="laborCost">Mano de Obra: </label>
            <input
              type="number"
              id="laborCost"
              step="0.01"
              value={additionalCosts.labor}
              onChange={(e) => onAdditionalCostsChange({ ...additionalCosts, labor: e.target.value })}
              placeholder="0.00"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div>
            <label htmlFor="packagingCost">Empaque: </label>
            <input
              type="number"
              id="packagingCost"
              step="0.01"
              value={additionalCosts.packaging}
              onChange={(e) => onAdditionalCostsChange({ ...additionalCosts, packaging: e.target.value })}
              placeholder="0.00"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div>
            <label htmlFor="transportCost">Transporte: </label>
            <input
              type="number"
              id="transportCost"
              step="0.01"
              value={additionalCosts.transport}
              onChange={(e) => onAdditionalCostsChange({ ...additionalCosts, transport: e.target.value })}
              placeholder="0.00"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
        </div>
        {additionalCostsTotal > 0 && (
          <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
            Total Costos Adicionales: ${additionalCostsTotal.toFixed(2)}
          </div>
        )}
      </div>

      <div className="section-divider"></div>

      <div className="expenses-table-wrapper" style={{ marginBottom: '1rem' }}>
        <table>
          <thead>
            <tr>
              <th>Total de Gastos</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <label htmlFor="expensesPercentage">Porcentaje de Gastos: </label>
                  <input
                    type="number"
                    id="expensesPercentage"
                    placeholder="%"
                    value={expensesPercentage}
                    onChange={(e) => onExpensesPercentageChange(e.target.value)}
                    style={{ width: '100px', padding: '8px', maxWidth: '100%' }}
                    step="0.01"
                  />
                </div>
                <div style={{ marginTop: '1rem', fontSize: '1.2em', fontWeight: 'bold' }}>
                  ${totalExpenses.toFixed(2)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="button">
        <p>Total General: <span>${totalWithAdditional.toFixed(2)}</span></p>
        {portions > 1 && (
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
            Costo por porción: <span>${costPerPortion.toFixed(2)}</span>
          </p>
        )}
      </div>

      {/* Múltiples niveles de ganancia */}
      <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Niveles de Ganancia</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label htmlFor="profitMin">Mínimo (%): </label>
            <input
              type="number"
              id="profitMin"
              step="0.01"
              value={profitLevels.minimum}
              onChange={(e) => onProfitLevelsChange({ ...profitLevels, minimum: e.target.value })}
              placeholder="0.00"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div>
            <label htmlFor="profitTarget">Objetivo (%): </label>
            <input
              type="number"
              id="profitTarget"
              step="0.01"
              value={profitLevels.target}
              onChange={(e) => onProfitLevelsChange({ ...profitLevels, target: e.target.value })}
              placeholder="0.00"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div>
            <label htmlFor="profitMax">Máximo (%): </label>
            <input
              type="number"
              id="profitMax"
              step="0.01"
              value={profitLevels.maximum}
              onChange={(e) => onProfitLevelsChange({ ...profitLevels, maximum: e.target.value })}
              placeholder="0.00"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
        </div>
        {/* Fallback a ganancia simple si no hay niveles */}
        {(!profitLevels.minimum && !profitLevels.target && !profitLevels.maximum) && (
          <div className="input-container centered" style={{ marginTop: '1rem' }}>
            <label htmlFor="profitPercentage">Porcentaje de Ganancia: </label>
            <input
              type="number"
              id="profitPercentage"
              placeholder="%"
              value={profitPercentage}
              onChange={(e) => onProfitPercentageChange(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Precios de venta sugeridos */}
      <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Precios de Venta Sugeridos</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {profitMin > 0 && (
            <div style={{ padding: '1rem', background: '#FEF3C7', borderRadius: '8px' }}>
              <strong>Precio Mínimo:</strong>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#D97706' }}>
                ${totalWithProfitMin.toFixed(2)}
              </div>
              {portions > 1 && (
                <div style={{ fontSize: '0.875rem', color: '#92400E' }}>
                  ${(totalWithProfitMin / portions).toFixed(2)} por porción
                </div>
              )}
            </div>
          )}
          {profitTarget > 0 && (
            <div style={{ padding: '1rem', background: '#D1FAE5', borderRadius: '8px' }}>
              <strong>Precio Objetivo:</strong>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#059669' }}>
                ${totalWithProfitTarget.toFixed(2)}
              </div>
              {portions > 1 && (
                <div style={{ fontSize: '0.875rem', color: '#047857' }}>
                  ${(totalWithProfitTarget / portions).toFixed(2)} por porción
                </div>
              )}
            </div>
          )}
          {profitMax > 0 && (
            <div style={{ padding: '1rem', background: '#DBEAFE', borderRadius: '8px' }}>
              <strong>Precio Máximo:</strong>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2563EB' }}>
                ${totalWithProfitMax.toFixed(2)}
              </div>
              {portions > 1 && (
                <div style={{ fontSize: '0.875rem', color: '#1E40AF' }}>
                  ${(totalWithProfitMax / portions).toFixed(2)} por porción
                </div>
              )}
            </div>
          )}
        </div>
        {(!profitMin && !profitTarget && !profitMax && profitPercentage) && (
          <div className="button">
            <p>Total con Ganancia: <span>${totalWithProfit.toFixed(2)}</span></p>
            {portions > 1 && (
              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                ${(totalWithProfit / portions).toFixed(2)} por porción
              </p>
            )}
          </div>
        )}
      </div>

      {/* Notas */}
      <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="recipeNotes" style={{ marginBottom: '0.5rem', fontWeight: '600', color: 'var(--dark)' }}>Notas/Observaciones:</label>
        <textarea
          id="recipeNotes"
          value={recipeNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Agregar notas, instrucciones especiales, etc."
          rows="4"
          style={{ 
            width: '100%', 
            maxWidth: '600px', 
            padding: '12px', 
            borderRadius: '8px',
            border: '2px solid var(--gray-light)',
            fontFamily: 'inherit',
            fontSize: '14px'
          }}
        />
      </div>

      <div id="actionButtons" className="button">
        <button onClick={onSaveRecipe}>
          {isEditing ? 'Guardar cambios' : 'Guardar Receta'}
        </button>
        {!isEditing && <button onClick={onReset}>Borrar Todo</button>}
      </div>
      </div>
    </div>
  );
}

export default MainScreen;
