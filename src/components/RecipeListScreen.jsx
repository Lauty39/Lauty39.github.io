import React, { useState, useMemo } from 'react';

function RecipeListScreen({ 
  recipes, 
  products, 
  expenses, 
  onLoadRecipe, 
  onDeleteRecipe, 
  onDuplicateRecipe,
  onToggleFavorite,
  onExportPDF,
  onBack, 
  onNewRecipe 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, date, price
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [filterCategory, setFilterCategory] = useState('');
  const [filterTags, setFilterTags] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Calcular total con ganancia para una receta
  const calculateRecipeTotal = (recipe) => {
    // Calcular costos
    let totalCost = 0;
    if (recipe.costData && Array.isArray(recipe.costData)) {
      recipe.costData.forEach(row => {
        if (row.productId) {
          const product = products.find(p => p.id === row.productId);
          if (product) {
            const qAdq = parseFloat(product.quantity) || 0;
            const price = parseFloat(product.price) || 0;
            const qUsed = parseFloat(row.quantityUsed) || 0;
            totalCost += qAdq ? (qUsed * price / qAdq) : 0;
          }
        }
      });
    }

    // Costos adicionales
    const additionalCosts = recipe.additionalCosts || {};
    const labor = parseFloat(additionalCosts.labor) || 0;
    const packaging = parseFloat(additionalCosts.packaging) || 0;
    const transport = parseFloat(additionalCosts.transport) || 0;
    totalCost += labor + packaging + transport;

    // Calcular gastos
    const totalMonthlyExpenses = expenses.reduce((sum, expense) => {
      return sum + (parseFloat(expense.monthlyAmount) || 0);
    }, 0);
    const expensesPercentage = parseFloat(recipe.expensesPercentage) || 0;
    const totalExpenses = totalMonthlyExpenses * expensesPercentage / 100;

    // Total general
    const totalAllCosts = totalCost + totalExpenses;
    const portions = parseFloat(recipe.portions) || 1;
    const costPerPortion = totalAllCosts / portions;

    // Aplicar ganancia (usar target si está disponible)
    const profitLevels = recipe.profitLevels || {};
    const profitPercentage = parseFloat(profitLevels.target || recipe.profit || 0);
    const totalWithProfit = totalAllCosts * (1 + profitPercentage / 100);

    return { total: totalWithProfit, perPortion: totalWithProfit / portions };
  };

  // Obtener todas las categorías únicas
  const categories = useMemo(() => {
    const cats = new Set(recipes.map(r => r.category).filter(Boolean));
    return Array.from(cats);
  }, [recipes]);

  // Obtener todas las etiquetas únicas
  const allTags = useMemo(() => {
    const tags = new Set();
    recipes.forEach(r => {
      if (r.tags && Array.isArray(r.tags)) {
        r.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, [recipes]);

  // Filtrar y ordenar recetas
  const filteredAndSortedRecipes = useMemo(() => {
    let filtered = recipes.filter(recipe => {
      // Búsqueda por nombre
      if (searchTerm && !recipe.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filtro por categoría
      if (filterCategory && recipe.category !== filterCategory) {
        return false;
      }

      // Filtro por etiquetas
      if (filterTags.length > 0) {
        const recipeTags = recipe.tags || [];
        if (!filterTags.some(tag => recipeTags.includes(tag))) {
          return false;
        }
      }

      // Filtro por favoritos
      if (showFavoritesOnly && !recipe.isFavorite) {
        return false;
      }

      // Filtro por rango de precio
      if (priceRange.min || priceRange.max) {
        const total = calculateRecipeTotal(recipe);
        if (priceRange.min && total.total < parseFloat(priceRange.min)) return false;
        if (priceRange.max && total.total > parseFloat(priceRange.max)) return false;
      }

      return true;
    });

    // Ordenar
    filtered = [...filtered].sort((a, b) => {
      let aVal, bVal;

      if (sortBy === 'name') {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (sortBy === 'date') {
        aVal = new Date(a.createdAt || 0).getTime();
        bVal = new Date(b.createdAt || 0).getTime();
      } else if (sortBy === 'price') {
        aVal = calculateRecipeTotal(a).total;
        bVal = calculateRecipeTotal(b).total;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [recipes, searchTerm, sortBy, sortOrder, filterCategory, filterTags, showFavoritesOnly, priceRange, products, expenses]);

  return (
    <div className="screen active">
      <div className="screen-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2>Recetas Guardadas</h2>
        
        {/* Búsqueda avanzada */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="search-container" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <input
                type="text"
                placeholder="Buscar receta por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="btn-primary" onClick={onNewRecipe}>Nueva Receta</button>
          </div>

          {/* Filtros avanzados */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <label>Ordenar por: </label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '8px', marginLeft: '8px' }}>
                <option value="name">Nombre</option>
                <option value="date">Fecha</option>
                <option value="price">Precio</option>
              </select>
              <button 
                className="btn-secondary" 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                style={{ marginLeft: '8px', padding: '8px 12px' }}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            {categories.length > 0 && (
              <div>
                <label>Categoría: </label>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ padding: '8px', marginLeft: '8px' }}>
                  <option value="">Todas</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              />
              Solo favoritos
            </label>

            <div>
              <label>Precio: </label>
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                style={{ width: '80px', padding: '8px', marginLeft: '8px' }}
              />
              <span> - </span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                style={{ width: '80px', padding: '8px' }}
              />
            </div>
          </div>
        </div>

      <div className="recipe-list">
        {recipes.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            No hay recetas guardadas. Crea tu primera receta desde "Crear Receta".
          </p>
        ) : filteredAndSortedRecipes.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            No se encontraron recetas que coincidan con los filtros aplicados.
          </p>
        ) : (
          filteredAndSortedRecipes.map((recipe) => {
            // Encontrar el índice original en el array completo para mantener la referencia correcta
            const originalIndex = recipes.findIndex(r => r === recipe);
            const totals = calculateRecipeTotal(recipe);
            const portions = recipe.portions || 1;
            
            return (
              <div key={originalIndex} className="recipe-item">
                <div className="recipe-info" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {recipe.image && (
                      <img 
                        src={recipe.image} 
                        alt={recipe.name}
                        style={{ 
                          width: '60px', 
                          height: '60px', 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          marginRight: '8px'
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <strong className="recipe-name">{recipe.name}</strong>
                      {recipe.isFavorite && <span style={{ color: '#FFD700', marginLeft: '8px' }}>⭐</span>}
                      {recipe.category && (
                        <span style={{ 
                          background: '#E0E7FF', 
                          color: '#6366F1', 
                          padding: '2px 8px', 
                          borderRadius: '12px', 
                          fontSize: '0.75rem',
                          marginLeft: '8px'
                        }}>
                          {recipe.category}
                        </span>
                      )}
                    </div>
                  </div>
                  {recipe.tags && recipe.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {recipe.tags.map((tag, i) => (
                        <span key={i} style={{ 
                          background: '#F3F4F6', 
                          color: '#6B7280', 
                          padding: '2px 6px', 
                          borderRadius: '8px', 
                          fontSize: '0.7rem' 
                        }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="recipe-total">
                    Total: ${totals.total.toFixed(2)}
                    {portions > 1 && ` (${portions} porciones: $${totals.perPortion.toFixed(2)} c/u)`}
                  </span>
                  {recipe.createdAt && (
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                      Creada: {new Date(recipe.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  )}
                </div>
                <div className="recipe-actions">
                  <button 
                    className="btn-secondary" 
                    onClick={() => onToggleFavorite(originalIndex)}
                    title={recipe.isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                  >
                    {recipe.isFavorite ? '⭐' : '☆'}
                  </button>
                  <button className="btn-primary" onClick={() => onLoadRecipe(originalIndex)}>Ver</button>
                  <button className="btn-secondary" onClick={() => onDuplicateRecipe(originalIndex)}>Duplicar</button>
                  <button className="btn-secondary" onClick={() => onExportPDF(originalIndex)}>PDF</button>
                  <button className="btn-danger" onClick={() => onDeleteRecipe(originalIndex)}>Eliminar</button>
                </div>
              </div>
            );
          })
        )}
      </div>
      </div>
    </div>
  );
}

export default RecipeListScreen;
