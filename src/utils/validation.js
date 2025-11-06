// Utilidades de validación
export const validateRecipe = (recipe) => {
  const errors = [];
  
  if (!recipe.name || recipe.name.trim() === '') {
    errors.push('El nombre de la receta es requerido');
  }
  
  if (recipe.costData && recipe.costData.length > 0) {
    const hasValidProduct = recipe.costData.some(row => 
      row.productId && row.quantityUsed && parseFloat(row.quantityUsed) > 0
    );
    if (!hasValidProduct) {
      errors.push('Debe agregar al menos un producto con cantidad utilizada');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateProduct = (product) => {
  const errors = [];
  
  if (!product.name || product.name.trim() === '') {
    errors.push('El nombre del producto es requerido');
  }
  
  if (!product.quantity || parseFloat(product.quantity) <= 0) {
    errors.push('La cantidad debe ser mayor a 0');
  }
  
  if (!product.price || parseFloat(product.price) < 0) {
    errors.push('El precio debe ser mayor o igual a 0');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateExpense = (expense) => {
  const errors = [];
  
  if (!expense.name || expense.name.trim() === '') {
    errors.push('El nombre del gasto es requerido');
  }
  
  if (!expense.monthlyAmount || parseFloat(expense.monthlyAmount) < 0) {
    errors.push('El gasto mensual debe ser mayor o igual a 0');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

