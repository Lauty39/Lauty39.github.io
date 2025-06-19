import React from 'react';

function RecipeList({ recipes, onView, onDelete }) {
  return (
    <div>
      <h2>Recetas Guardadas</h2>
      <div className="button">
        {/* El botón de volver se manejará desde el componente padre */}
      </div>
      <div className="recipe-list">
        {recipes.length === 0 && <p>No hay recetas guardadas.</p>}
        {recipes.map((r, i) => (
          <div className="recipe-item" key={i}>
            <strong>{r.name}</strong>
            <span>
              <button onClick={() => onView(i)}>Ver</button>
              <button onClick={() => onDelete(i)}>Eliminar</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipeList; 