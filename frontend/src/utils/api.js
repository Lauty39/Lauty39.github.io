let API_BASE_URL;

if (process.env.NODE_ENV === 'production') {
  // En producción, usamos la URL del backend en Render.
  // POR FAVOR, REEMPLAZA ESTA URL CON LA URL DE TU SERVICIO DE RENDER.
  API_BASE_URL = 'https://INGRESA-AQUI-LA-URL-DE-RENDER.onrender.com';
} else {
  // En desarrollo, usamos el backend local.
  API_BASE_URL = 'http://localhost:3001';
}

export default API_BASE_URL; 