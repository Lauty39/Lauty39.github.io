let API_BASE_URL;

if (process.env.NODE_ENV === 'production') {
  // En producción, usamos la URL del backend en Render.
  API_BASE_URL = 'https://lauty39-github-io.onrender.com';
} else {
  // En desarrollo, usamos el backend local.
  API_BASE_URL = 'http://localhost:3001';
}

export default API_BASE_URL; 