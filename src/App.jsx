import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import InicioScreen from './components/InicioScreen';
import MainScreen from './components/MainScreen';
import RecipeListScreen from './components/RecipeListScreen';
import ProductosScreen from './components/ProductosScreen';
import GastosScreen from './components/GastosScreen';
import SettingsScreen from './components/SettingsScreen';
import ConfirmDialog from './components/ConfirmDialog';
import StatisticsScreen from './components/StatisticsScreen';
import CalculatorScreen from './components/CalculatorScreen';
import TemplatesScreen from './components/TemplatesScreen';
import ExportImportScreen from './components/ExportImportScreen';
import { validateRecipe, validateProduct, validateExpense } from './utils/validation';
import { getLanguage, setLanguage } from './utils/i18n';
import { exportToJSON, exportToCSV, importFromJSON } from './utils/exportImport';
import { generateRecipePDF, generateAllRecipesPDF } from './utils/pdfGenerator';
import { initDB, saveData, loadData } from './utils/storage';

function App() {
  const [currentSection, setCurrentSection] = useState('inicio');
  const [recipeName, setRecipeName] = useState('');
  const [costRows, setCostRows] = useState([{ productId: '', quantityUsed: '' }]);
  const [expensesPercentage, setExpensesPercentage] = useState('');
  const [profitPercentage, setProfitPercentage] = useState('');
  const [currentEditingIndex, setCurrentEditingIndex] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [products, setProducts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  
  // Nuevos estados para mejoras
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [language, setLanguageState] = useState(getLanguage());
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [notifications, setNotifications] = useState([]);
  
  // Estados adicionales para nuevas funcionalidades
  const [recipeCategory, setRecipeCategory] = useState('');
  const [recipeTags, setRecipeTags] = useState([]);
  const [recipeNotes, setRecipeNotes] = useState('');
  const [recipePortions, setRecipePortions] = useState(1);
  const [recipeImage, setRecipeImage] = useState(null);
  const [additionalCosts, setAdditionalCosts] = useState({
    labor: '',
    packaging: '',
    transport: ''
  });
  const [profitLevels, setProfitLevels] = useState({
    minimum: '',
    target: '',
    maximum: ''
  });
  const [sellingUnit, setSellingUnit] = useState(''); // Unidad de medida de venta

  // Aplicar tema
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Inicializar IndexedDB
  useEffect(() => {
    if ('indexedDB' in window) {
      initDB().catch(console.error);
    }
  }, []);

  // Notificaciones de stock bajo (solo al cargar)
  useEffect(() => {
    const lowStockProducts = products.filter(p => p.stock !== null && parseFloat(p.stock) < 10);
    if (lowStockProducts.length > 0 && products.length > 0) {
      // Solo mostrar si hay productos con stock bajo
      const hasLowStock = lowStockProducts.length > 0;
      if (hasLowStock && !localStorage.getItem('stockWarningShown')) {
        const productNames = lowStockProducts.map(p => p.name).join(', ');
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message: `⚠️ ${lowStockProducts.length} producto(s) con stock bajo: ${productNames}`, type: 'error' }]);
        localStorage.setItem('stockWarningShown', 'true');
        setTimeout(() => localStorage.removeItem('stockWarningShown'), 60000); // Reset después de 1 minuto
      }
    }
  }, [products.length]); // Solo cuando cambia el número de productos

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const savedExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    setRecipes(savedRecipes);
    
    // Asignar IDs a productos si no los tienen (migración)
    const productsWithIds = savedProducts.map((product, index) => ({
      ...product,
      id: product.id || `product_${Date.now()}_${index}`,
      stock: product.stock !== undefined ? product.stock : null,
      supplier: product.supplier || '',
      priceHistory: product.priceHistory || []
    }));
    setProducts(productsWithIds);
    
    // Asignar IDs a gastos si no los tienen (migración)
    const expensesWithIds = savedExpenses.map((expense, index) => ({
      ...expense,
      id: expense.id || `expense_${Date.now()}_${index}`,
      category: expense.category || '',
      dueDate: expense.dueDate || null,
      isRecurring: expense.isRecurring || false
    }));
    setExpenses(expensesWithIds);
    
    // Guardar productos con IDs si se actualizaron
    if (productsWithIds.length > 0 && productsWithIds.some(p => !savedProducts.find(sp => sp.id === p.id))) {
      localStorage.setItem('products', JSON.stringify(productsWithIds));
    }
    
    // Guardar gastos con IDs si se actualizaron
    if (expensesWithIds.length > 0 && expensesWithIds.some(e => !savedExpenses.find(se => se.id === e.id))) {
      localStorage.setItem('expenses', JSON.stringify(expensesWithIds));
    }
  }, []);

  // Calcular costo individual basado en producto
  const calculateCost = (row) => {
    const product = products.find(p => p.id === row.productId);
    if (!product) return 0;
    
    const qAdq = parseFloat(product.quantity) || 0;
    const price = parseFloat(product.price) || 0;
    const qUsed = parseFloat(row.quantityUsed) || 0;
    
    return qAdq ? (qUsed * price / qAdq) : 0;
  };

  // Calcular total de gastos mensuales
  const totalMonthlyExpenses = expenses.reduce((sum, expense) => {
    return sum + (parseFloat(expense.monthlyAmount) || 0);
  }, 0);

  // Actualizar fila de costos
  const handleCostRowUpdate = (rowIndex, field, value) => {
    const newRows = [...costRows];
    newRows[rowIndex] = { ...newRows[rowIndex], [field]: value };
    setCostRows(newRows);
  };

  // Agregar fila de costos
  const handleCostRowAdd = () => {
    setCostRows([...costRows, { productId: '', quantityUsed: '' }]);
  };

  // Remover fila de costos
  const handleCostRowRemove = () => {
    if (costRows.length > 1) {
      setCostRows(costRows.slice(0, -1));
    }
  };

  // Calcular totales
  const totalCost = costRows.reduce((sum, row) => {
    return sum + calculateCost(row);
  }, 0);

  // Costos adicionales
  const additionalCostsTotal = (parseFloat(additionalCosts.labor) || 0) + 
                                (parseFloat(additionalCosts.packaging) || 0) + 
                                (parseFloat(additionalCosts.transport) || 0);

  // Calcular total de gastos basado en el porcentaje
  const totalExpenses = totalMonthlyExpenses * (parseFloat(expensesPercentage) || 0) / 100;

  const totalAllCosts = totalCost + totalExpenses;
  const profitTarget = parseFloat(profitLevels.target) || parseFloat(profitPercentage) || 0;
  const totalWithProfit = totalAllCosts * (1 + profitTarget / 100);

  // Gestión de productos
  const handleAddProduct = (productData) => {
    const newProduct = {
      id: `product_${Date.now()}_${Math.random()}`,
      name: productData.name,
      quantity: productData.quantity,
      unit: productData.unit || 'g',
      price: productData.price,
      stock: productData.stock || null,
      supplier: productData.supplier || '',
      priceHistory: productData.priceHistory || []
    };
    const newProducts = [...products, newProduct];
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
  };

  const handleUpdateProduct = (index, productData) => {
    const newProducts = [...products];
    newProducts[index] = {
      ...newProducts[index],
      name: productData.name,
      quantity: productData.quantity,
      unit: productData.unit || 'g',
      price: productData.price,
      stock: productData.stock || null,
      supplier: productData.supplier || '',
      priceHistory: productData.priceHistory || newProducts[index].priceHistory || []
    };
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
  };

  const handleDeleteProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
  };

  // Gestión de gastos
  const handleAddExpense = (expenseData) => {
    const newExpense = {
      id: `expense_${Date.now()}_${Math.random()}`,
      name: expenseData.name,
      monthlyAmount: expenseData.monthlyAmount,
      category: expenseData.category || '',
      dueDate: expenseData.dueDate || null,
      isRecurring: expenseData.isRecurring || false
    };
    const newExpenses = [...expenses, newExpense];
    setExpenses(newExpenses);
    localStorage.setItem('expenses', JSON.stringify(newExpenses));
  };

  const handleUpdateExpense = (index, expenseData) => {
    const newExpenses = [...expenses];
    newExpenses[index] = {
      ...newExpenses[index],
      name: expenseData.name,
      monthlyAmount: expenseData.monthlyAmount,
      category: expenseData.category || '',
      dueDate: expenseData.dueDate || null,
      isRecurring: expenseData.isRecurring || false
    };
    setExpenses(newExpenses);
    localStorage.setItem('expenses', JSON.stringify(newExpenses));
  };

  const handleDeleteExpense = (index) => {
    const newExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(newExpenses);
    localStorage.setItem('expenses', JSON.stringify(newExpenses));
  };

  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  // Guardar receta con validación
  const handleSaveRecipe = useCallback(() => {
    const recipe = {
      name: recipeName,
      costData: costRows,
      expensesPercentage: expensesPercentage,
      profit: profitPercentage,
      category: recipeCategory,
      tags: recipeTags,
      notes: recipeNotes,
      portions: recipePortions,
      image: recipeImage,
      additionalCosts: additionalCosts,
      profitLevels: profitLevels,
      sellingUnit: sellingUnit,
      createdAt: currentEditingIndex !== null ? recipes[currentEditingIndex]?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: currentEditingIndex !== null ? (recipes[currentEditingIndex]?.version || 1) + 1 : 1,
      isFavorite: currentEditingIndex !== null ? recipes[currentEditingIndex]?.isFavorite || false : false
    };

    const validation = validateRecipe(recipe);
    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }

    const newRecipes = [...recipes];
    if (currentEditingIndex !== null) {
      newRecipes[currentEditingIndex] = recipe;
      showNotification('Receta actualizada exitosamente', 'success');
    } else {
      newRecipes.push(recipe);
      showNotification('Receta guardada exitosamente', 'success');
    }

    setRecipes(newRecipes);
    localStorage.setItem('recipes', JSON.stringify(newRecipes));
    setRecipeName('');
    setCostRows([{ productId: '', quantityUsed: '' }]);
    setExpensesPercentage('');
    setProfitPercentage('');
    setRecipeCategory('');
    setRecipeTags([]);
    setRecipeNotes('');
    setRecipePortions(1);
    setRecipeImage(null);
    setAdditionalCosts({ labor: '', packaging: '', transport: '' });
    setProfitLevels({ minimum: '', target: '', maximum: '' });
    setSellingUnit('');
    setCurrentEditingIndex(null);
    setCurrentSection('recetas');
  }, [recipeName, costRows, expensesPercentage, profitPercentage, recipeCategory, recipeTags, recipeNotes, recipePortions, recipeImage, additionalCosts, profitLevels, sellingUnit, currentEditingIndex, recipes, showNotification]);

  // Cargar receta
  const handleLoadRecipe = (index) => {
    const recipe = recipes[index];
    setRecipeName(recipe.name || '');
    setProfitPercentage(recipe.profit || '');
    setExpensesPercentage(recipe.expensesPercentage || '');
    setRecipeCategory(recipe.category || '');
    setRecipeTags(recipe.tags || []);
    setRecipeNotes(recipe.notes || '');
    setRecipePortions(recipe.portions || 1);
    setRecipeImage(recipe.image || null);
    setAdditionalCosts(recipe.additionalCosts || { labor: '', packaging: '', transport: '' });
    setProfitLevels(recipe.profitLevels || { minimum: '', target: '', maximum: '' });
    setSellingUnit(recipe.sellingUnit || '');
    
    // Convertir datos antiguos si es necesario (migración)
    if (Array.isArray(recipe.costData) && recipe.costData.length > 0) {
      if (Array.isArray(recipe.costData[0])) {
        // Formato antiguo: convertir a nuevo formato
        const convertedRows = recipe.costData
          .filter(row => row[0]) // Solo filas con nombre de producto
          .map(row => {
            // Buscar producto por nombre
            const product = products.find(p => p.name === row[0]);
            return product ? { productId: product.id, quantityUsed: row[3] || '' } : null;
          })
          .filter(Boolean);
        setCostRows(convertedRows.length > 0 ? convertedRows : [{ productId: '', quantityUsed: '' }]);
      } else {
        // Formato nuevo
        setCostRows(recipe.costData.length > 0 ? recipe.costData : [{ productId: '', quantityUsed: '' }]);
      }
    } else {
      setCostRows([{ productId: '', quantityUsed: '' }]);
    }
    
    setCurrentEditingIndex(index);
    setCurrentSection('crear-receta');
  };

  // Duplicar receta
  const handleDuplicateRecipe = (index) => {
    const recipe = recipes[index];
    const newRecipe = {
      ...recipe,
      name: `${recipe.name} (Copia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      isFavorite: false
    };
    const newRecipes = [...recipes, newRecipe];
    setRecipes(newRecipes);
    localStorage.setItem('recipes', JSON.stringify(newRecipes));
    showNotification('Receta duplicada exitosamente', 'success');
  };

  // Toggle favorito
  const handleToggleFavorite = (index) => {
    const newRecipes = [...recipes];
    newRecipes[index] = { ...newRecipes[index], isFavorite: !newRecipes[index].isFavorite };
    setRecipes(newRecipes);
    localStorage.setItem('recipes', JSON.stringify(newRecipes));
  };

  // Exportar datos
  const handleExportData = (type) => {
    if (type === 'json') {
      const data = { recipes, products, expenses, exportedAt: new Date().toISOString() };
      exportToJSON(data, `datos-export-${new Date().toISOString().split('T')[0]}.json`);
      showNotification('Datos exportados exitosamente', 'success');
    } else if (type === 'csv') {
      exportToCSV(recipes, `recetas-export-${new Date().toISOString().split('T')[0]}.csv`);
      showNotification('Datos exportados exitosamente', 'success');
    }
  };

  // Importar datos con confirmación
  const handleImportData = (file) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Importar Datos',
      message: '⚠️ Importar datos reemplazará todos los datos actuales. ¿Estás seguro de continuar?',
      onConfirm: () => {
        importFromJSON(file)
          .then(data => {
            if (data.recipes) {
              setRecipes(data.recipes);
              localStorage.setItem('recipes', JSON.stringify(data.recipes));
            }
            if (data.products) {
              setProducts(data.products);
              localStorage.setItem('products', JSON.stringify(data.products));
            }
            if (data.expenses) {
              setExpenses(data.expenses);
              localStorage.setItem('expenses', JSON.stringify(data.expenses));
            }
            setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
            showNotification('Datos importados exitosamente', 'success');
          })
          .catch(error => {
            setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
            showNotification('Error al importar datos: ' + error.message, 'error');
          });
      },
      onCancel: () => setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null })
    });
  };

  // Exportar PDF de receta individual
  const handleExportPDF = (index) => {
    const recipe = recipes[index];
    generateRecipePDF(recipe, products, expenses);
    showNotification('PDF generado exitosamente', 'success');
  };

  // Exportar PDF con todas las recetas
  const handleExportAllRecipesPDF = () => {
    if (recipes.length === 0) {
      showNotification('No hay recetas para exportar', 'error');
      return;
    }
    generateAllRecipesPDF(recipes, products, expenses);
    showNotification('PDF generado exitosamente', 'success');
  };

  // Eliminar receta con confirmación
  const handleDeleteRecipe = (index) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Receta',
      message: `¿Estás seguro de eliminar "${recipes[index].name}"? Esta acción no se puede deshacer.`,
      onConfirm: () => {
        const newRecipes = recipes.filter((_, i) => i !== index);
        setRecipes(newRecipes);
        localStorage.setItem('recipes', JSON.stringify(newRecipes));
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
        showNotification('Receta eliminada', 'success');
      },
      onCancel: () => setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null })
    });
  };

  // Resetear página con confirmación
  const handleReset = (template = null) => {
    if (template) {
      // Usar plantilla
      setRecipeName('');
      setCostRows([{ productId: '', quantityUsed: '' }]);
      setExpensesPercentage('');
      setProfitPercentage(template.defaultProfit || '');
      setRecipeCategory(template.category || '');
      setRecipeTags([]);
      setRecipeNotes('');
      setRecipePortions(template.defaultPortions || 1);
      setRecipeImage(null);
      setAdditionalCosts({ labor: '', packaging: '', transport: '' });
      setProfitLevels({ minimum: '', target: template.defaultProfit || '', maximum: '' });
      setSellingUnit('');
      setCurrentEditingIndex(null);
    } else if (recipeName || costRows.some(r => r.productId || r.quantityUsed)) {
      setConfirmDialog({
        isOpen: true,
        title: 'Borrar Todo',
        message: '¿Estás seguro de borrar todo? Se perderán todos los datos no guardados.',
        onConfirm: () => {
          setRecipeName('');
          setCostRows([{ productId: '', quantityUsed: '' }]);
          setExpensesPercentage('');
          setProfitPercentage('');
          setRecipeCategory('');
          setRecipeTags([]);
          setRecipeNotes('');
          setRecipePortions(1);
          setRecipeImage(null);
          setAdditionalCosts({ labor: '', packaging: '', transport: '' });
          setProfitLevels({ minimum: '', target: '', maximum: '' });
          setCurrentEditingIndex(null);
          setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
        },
        onCancel: () => setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null })
      });
    } else {
      setRecipeName('');
      setCostRows([{ productId: '', quantityUsed: '' }]);
      setExpensesPercentage('');
      setProfitPercentage('');
      setRecipeCategory('');
      setRecipeTags([]);
      setRecipeNotes('');
      setRecipePortions(1);
      setRecipeImage(null);
      setAdditionalCosts({ labor: '', packaging: '', transport: '' });
      setProfitLevels({ minimum: '', target: '', maximum: '' });
      setCurrentEditingIndex(null);
    }
  };

  // Cambiar sección
  const handleSectionChange = (section) => {
    setCurrentSection(section);
    if (section === 'crear-receta') {
      // Si vamos a crear receta, limpiar si no estamos editando
      if (currentEditingIndex === null) {
        handleReset();
      }
    }
  };

  // Navegación por teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + S para guardar receta
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && currentSection === 'crear-receta') {
        e.preventDefault();
        handleSaveRecipe();
      }
      // Escape para cerrar diálogos
      if (e.key === 'Escape' && confirmDialog.isOpen) {
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSection, confirmDialog.isOpen, handleSaveRecipe]);

  return (
    <div className="app-container">
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      <Header currentSection={currentSection} onSectionChange={handleSectionChange} />
      
      <main id="main-content">
      
      {currentSection === 'inicio' && <InicioScreen />}
      
      {currentSection === 'recetas' && (
        <RecipeListScreen
          recipes={recipes}
          products={products}
          expenses={expenses}
          onLoadRecipe={handleLoadRecipe}
          onDeleteRecipe={handleDeleteRecipe}
          onDuplicateRecipe={handleDuplicateRecipe}
          onToggleFavorite={handleToggleFavorite}
          onExportPDF={handleExportPDF}
          onBack={() => setCurrentSection('inicio')}
          onNewRecipe={() => {
            handleReset();
            setCurrentSection('crear-receta');
          }}
        />
      )}
      
      {currentSection === 'crear-receta' && (
        <MainScreen
          recipeName={recipeName}
          onRecipeNameChange={setRecipeName}
          costRows={costRows}
          products={products}
          onCostRowUpdate={handleCostRowUpdate}
          onCostRowAdd={handleCostRowAdd}
          onCostRowRemove={handleCostRowRemove}
          totalCost={totalCost}
          totalExpenses={totalExpenses}
          totalAllCosts={totalAllCosts}
          expensesPercentage={expensesPercentage}
          onExpensesPercentageChange={setExpensesPercentage}
          profitPercentage={profitPercentage}
          onProfitPercentageChange={setProfitPercentage}
          totalWithProfit={totalWithProfit}
          onSaveRecipe={handleSaveRecipe}
          onReset={handleReset}
          isEditing={currentEditingIndex !== null}
          category={recipeCategory}
          onCategoryChange={setRecipeCategory}
          tags={recipeTags}
          onTagsChange={setRecipeTags}
          notes={recipeNotes}
          onNotesChange={setRecipeNotes}
          portions={recipePortions}
          onPortionsChange={setRecipePortions}
          image={recipeImage}
          onImageChange={setRecipeImage}
          additionalCosts={additionalCosts}
          onAdditionalCostsChange={setAdditionalCosts}
          profitLevels={profitLevels}
          onProfitLevelsChange={setProfitLevels}
          sellingUnit={sellingUnit}
          onSellingUnitChange={setSellingUnit}
        />
      )}
      
      {currentSection === 'productos' && (
        <ProductosScreen
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {currentSection === 'gastos' && (
        <GastosScreen
          expenses={expenses}
          onAddExpense={handleAddExpense}
          onUpdateExpense={handleUpdateExpense}
          onDeleteExpense={handleDeleteExpense}
        />
      )}

      {currentSection === 'estadisticas' && (
        <StatisticsScreen
          recipes={recipes}
          products={products}
          expenses={expenses}
        />
      )}

      {currentSection === 'calculadora' && (
        <CalculatorScreen />
      )}

      {currentSection === 'plantillas' && (
        <TemplatesScreen
          onUseTemplate={(template) => {
            setRecipeCategory(template.category);
            setRecipePortions(template.defaultPortions);
            setProfitPercentage(template.defaultProfit);
            setCurrentSection('crear-receta');
          }}
        />
      )}

      {currentSection === 'exportar-importar' && (
        <ExportImportScreen
          onExportPDF={handleExportAllRecipesPDF}
        />
      )}

      {currentSection === 'configuracion' && (
        <SettingsScreen
          currentTheme={theme}
          onThemeChange={setTheme}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm || (() => {})}
        onCancel={() => setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null })}
      />

      {/* Notificaciones */}
      <div className="notifications-container">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification notification-${notification.type}`}>
            {notification.message}
          </div>
        ))}
      </div>

      </main>

      <footer className="app-footer" role="contentinfo">
        <p>&copy; {new Date().getFullYear()} LMSystems. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
