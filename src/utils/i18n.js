// Sistema de internacionalización
const translations = {
  es: {
    app: {
      title: 'Software de Costos',
      inicio: 'Inicio',
      recetas: 'Recetas',
      crearReceta: 'Crear Receta',
      productos: 'Productos',
      gastos: 'Gastos',
      guardar: 'Guardar',
      cancelar: 'Cancelar',
      eliminar: 'Eliminar',
      editar: 'Editar',
      buscar: 'Buscar',
      total: 'Total',
      precio: 'Precio',
      cantidad: 'Cantidad',
      nombre: 'Nombre',
      acciones: 'Acciones',
      nuevo: 'Nuevo',
      guardarCambios: 'Guardar cambios',
      borrarTodo: 'Borrar Todo',
      ver: 'Ver',
      duplicar: 'Duplicar',
      favorito: 'Favorito',
      exportar: 'Exportar',
      importar: 'Importar',
      estadisticas: 'Estadísticas',
      reportes: 'Reportes',
      modoOscuro: 'Modo Oscuro',
      modoClaro: 'Modo Claro',
      configuracion: 'Configuración',
      idioma: 'Idioma',
      categorias: 'Categorías',
      etiquetas: 'Etiquetas',
      notas: 'Notas',
      stock: 'Stock',
      proveedores: 'Proveedores',
      exportarPDF: 'Exportar PDF',
      exportarJSON: 'Exportar JSON',
      exportarCSV: 'Exportar CSV',
      importarJSON: 'Importar JSON',
      confirmar: 'Confirmar',
      si: 'Sí',
      no: 'No',
    },
    messages: {
      recetaGuardada: 'Receta guardada exitosamente',
      recetaActualizada: 'Receta actualizada exitosamente',
      recetaEliminada: 'Receta eliminada',
      productoAgregado: 'Producto agregado exitosamente',
      productoActualizado: 'Producto actualizado exitosamente',
      productoEliminado: 'Producto eliminado',
      gastoAgregado: 'Gasto agregado exitosamente',
      gastoActualizado: 'Gasto actualizado exitosamente',
      gastoEliminado: 'Gasto eliminado',
      confirmarEliminar: '¿Estás seguro de eliminar este elemento?',
      confirmarReset: '¿Estás seguro de borrar todo? Se perderán todos los datos no guardados.',
      campoRequerido: 'Este campo es requerido',
      datosExportados: 'Datos exportados exitosamente',
      datosImportados: 'Datos importados exitosamente',
      errorImportar: 'Error al importar datos',
    }
  },
  en: {
    app: {
      title: 'Cost Management Software',
      inicio: 'Home',
      recetas: 'Recipes',
      crearReceta: 'Create Recipe',
      productos: 'Products',
      gastos: 'Expenses',
      guardar: 'Save',
      cancelar: 'Cancel',
      eliminar: 'Delete',
      editar: 'Edit',
      buscar: 'Search',
      total: 'Total',
      precio: 'Price',
      cantidad: 'Quantity',
      nombre: 'Name',
      acciones: 'Actions',
      nuevo: 'New',
      guardarCambios: 'Save changes',
      borrarTodo: 'Clear All',
      ver: 'View',
      duplicar: 'Duplicate',
      favorito: 'Favorite',
      exportar: 'Export',
      importar: 'Import',
      estadisticas: 'Statistics',
      reportes: 'Reports',
      modoOscuro: 'Dark Mode',
      modoClaro: 'Light Mode',
      configuracion: 'Settings',
      idioma: 'Language',
      categorias: 'Categories',
      etiquetas: 'Tags',
      notas: 'Notes',
      stock: 'Stock',
      proveedores: 'Suppliers',
      exportarPDF: 'Export PDF',
      exportarJSON: 'Export JSON',
      exportarCSV: 'Export CSV',
      importarJSON: 'Import JSON',
      confirmar: 'Confirm',
      si: 'Yes',
      no: 'No',
    },
    messages: {
      recetaGuardada: 'Recipe saved successfully',
      recetaActualizada: 'Recipe updated successfully',
      recetaEliminada: 'Recipe deleted',
      productoAgregado: 'Product added successfully',
      productoActualizado: 'Product updated successfully',
      productoEliminado: 'Product deleted',
      gastoAgregado: 'Expense added successfully',
      gastoActualizado: 'Expense updated successfully',
      gastoEliminado: 'Expense deleted',
      confirmarEliminar: 'Are you sure you want to delete this item?',
      confirmarReset: 'Are you sure you want to clear all? All unsaved data will be lost.',
      campoRequerido: 'This field is required',
      datosExportados: 'Data exported successfully',
      datosImportados: 'Data imported successfully',
      errorImportar: 'Error importing data',
    }
  }
};

let currentLanguage = localStorage.getItem('language') || 'es';

export const setLanguage = (lang) => {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  return lang;
};

export const getLanguage = () => currentLanguage;

export const t = (key, params = {}) => {
  const keys = key.split('.');
  let value = translations[currentLanguage];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  if (!value) {
    // Fallback a español
    value = translations.es;
    for (const k of keys) {
      value = value?.[k];
    }
  }
  
  if (typeof value === 'string' && Object.keys(params).length > 0) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, key) => params[key] || match);
  }
  
  return value || key;
};

