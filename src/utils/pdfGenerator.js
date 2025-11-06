import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateRecipePDF = (recipe, products, expenses) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(20);
  doc.text('Receta: ' + recipe.name, 14, 20);
  
  // Fecha
  doc.setFontSize(10);
  doc.text('Fecha: ' + new Date().toLocaleDateString('es-ES'), 14, 30);
  
  let yPos = 40;
  
  // Costos
  if (recipe.costData && recipe.costData.length > 0) {
    doc.setFontSize(14);
    doc.text('Productos Utilizados:', 14, yPos);
    yPos += 10;
    
    const costTableData = recipe.costData
      .filter(row => row.productId)
      .map(row => {
        const product = products.find(p => p.id === row.productId);
        if (!product) return null;
        
        const qAdq = parseFloat(product.quantity) || 0;
        const price = parseFloat(product.price) || 0;
        const qUsed = parseFloat(row.quantityUsed) || 0;
        const cost = qAdq ? (qUsed * price / qAdq) : 0;
        
        return [
          product.name,
          `${qUsed} ${product.unit || 'g'}`,
          `$${cost.toFixed(2)}`
        ];
      })
      .filter(Boolean);
    
    if (costTableData.length > 0) {
      doc.autoTable({
        startY: yPos,
        head: [['Producto', 'Cantidad Utilizada', 'Costo']],
        body: costTableData,
        theme: 'grid',
        headStyles: { fillColor: [99, 102, 241] }
      });
      yPos = doc.lastAutoTable.finalY + 15;
    }
  }
  
  // Gastos
  const totalMonthlyExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.monthlyAmount) || 0), 0);
  const expensesPercentage = parseFloat(recipe.expensesPercentage) || 0;
  const totalExpenses = totalMonthlyExpenses * expensesPercentage / 100;
  
  if (totalExpenses > 0) {
    doc.setFontSize(12);
    doc.text(`Gastos (${expensesPercentage}%): $${totalExpenses.toFixed(2)}`, 14, yPos);
    yPos += 10;
  }
  
  // Totales
  let totalCost = 0;
  if (recipe.costData) {
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
  
  const totalAllCosts = totalCost + totalExpenses;
  const profitPercentage = parseFloat(recipe.profit) || 0;
  const totalWithProfit = totalAllCosts * (1 + profitPercentage / 100);
  
  doc.setFontSize(14);
  doc.text('Resumen de Costos:', 14, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.text(`Total de Costos: $${totalCost.toFixed(2)}`, 14, yPos);
  yPos += 7;
  doc.text(`Total de Gastos: $${totalExpenses.toFixed(2)}`, 14, yPos);
  yPos += 7;
  doc.text(`Total General: $${totalAllCosts.toFixed(2)}`, 14, yPos);
  yPos += 7;
  doc.text(`Ganancia (${profitPercentage}%): $${(totalWithProfit - totalAllCosts).toFixed(2)}`, 14, yPos);
  yPos += 7;
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(`Precio de Venta Sugerido: $${totalWithProfit.toFixed(2)}`, 14, yPos);
  
  // Notas si existen
  if (recipe.notes && recipe.notes.trim()) {
    yPos += 15;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Notas:', 14, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const notesLines = doc.splitTextToSize(recipe.notes, 180);
    doc.text(notesLines, 14, yPos);
  }
  
  doc.save(`receta-${recipe.name.replace(/\s+/g, '-')}.pdf`);
};

// Función para calcular el total con ganancia de una receta (igual que en RecipeListScreen)
const calculateRecipeTotal = (recipe, products, expenses) => {
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

  // Aplicar ganancia (usar target si está disponible)
  const profitLevels = recipe.profitLevels || {};
  const profitPercentage = parseFloat(profitLevels.target || recipe.profit || 0);
  const totalWithProfit = totalAllCosts * (1 + profitPercentage / 100);

  return totalWithProfit;
};

// Generar PDF con todas las recetas en formato tabla
export const generateAllRecipesPDF = (recipes, products, expenses) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(20);
  doc.text('Lista de Recetas', 14, 20);
  
  // Fecha
  doc.setFontSize(10);
  doc.text('Fecha: ' + new Date().toLocaleDateString('es-ES'), 14, 30);
  
  // Función para formatear números con coma como separador decimal (formato argentino)
  const formatNumber = (num) => {
    if (isNaN(num) || num === null || num === undefined) return '0,00';
    return parseFloat(num).toFixed(2).replace('.', ',');
  };
  
  // Preparar datos de la tabla
  const tableData = recipes.map(recipe => {
    const totalWithProfit = calculateRecipeTotal(recipe, products, expenses);
    const sellingUnit = recipe.sellingUnit || '';
    
    // Calcular precio por unidad
    let pricePerUnit = '-';
    if (sellingUnit && sellingUnit.trim() !== '') {
      if (sellingUnit === 'Docena/Unidad') {
        // Dividir por 10 en lugar de 12
        const unitPrice = totalWithProfit / 10;
        pricePerUnit = `$${formatNumber(unitPrice)}`;
      } else {
        // Para kilogramo, unidad u otras unidades, mostrar el precio total
        pricePerUnit = `$${formatNumber(totalWithProfit)}`;
      }
    }
    
    return [
      recipe.name || '-',
      `$${formatNumber(totalWithProfit)}`,
      pricePerUnit,
      sellingUnit || '-'
    ];
  });
  
  // Generar tabla
  doc.autoTable({
    startY: 40,
    head: [['Producto', 'Precio Venta $', 'Precio por unidad $', 'Unidad de medida']],
    body: tableData,
    theme: 'grid',
    headStyles: { 
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 60 }, // Producto
      1: { cellWidth: 40, halign: 'right' }, // Precio Venta
      2: { cellWidth: 40, halign: 'right' }, // Precio por unidad
      3: { cellWidth: 50 } // Unidad de medida
    }
  });
  
  doc.save(`lista-recetas-${new Date().toISOString().split('T')[0]}.pdf`);
};

