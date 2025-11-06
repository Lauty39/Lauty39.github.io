// Utilidades para almacenamiento mejorado (IndexedDB)
let db = null;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CostosDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('recipes')) {
        const recipeStore = db.createObjectStore('recipes', { keyPath: 'id', autoIncrement: true });
        recipeStore.createIndex('name', 'name', { unique: false });
        recipeStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('products')) {
        const productStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
        productStore.createIndex('name', 'name', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('expenses')) {
        const expenseStore = db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
        expenseStore.createIndex('name', 'name', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('priceHistory')) {
        const priceStore = db.createObjectStore('priceHistory', { keyPath: 'id', autoIncrement: true });
        priceStore.createIndex('productId', 'productId', { unique: false });
        priceStore.createIndex('date', 'date', { unique: false });
      }
    };
  });
};

export const saveToIndexedDB = async (storeName, data) => {
  if (!db) await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllFromIndexedDB = async (storeName) => {
  if (!db) await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Mantener compatibilidad con localStorage como fallback
export const saveData = async (key, data) => {
  try {
    if ('indexedDB' in window) {
      // Usar IndexedDB si está disponible
      await initDB();
      // Guardar en IndexedDB y localStorage como backup
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      // Fallback a localStorage
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    // Si falla, usar localStorage
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const loadData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

