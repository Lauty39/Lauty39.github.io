# Despliegue de la App: Backend + Frontend

## 1. Desplegar el Backend en Render

1. Ve a [https://render.com/](https://render.com/) y crea una cuenta (o inicia sesión).
2. Haz clic en "New +" > "Web Service".
3. Conecta tu repositorio de GitHub y selecciona la carpeta `backend` de tu proyecto.
4. Configura:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Root Directory**: `backend`
   - **Port**: Render detecta automáticamente `process.env.PORT`
5. Haz deploy y espera a que Render te dé una URL pública (ejemplo: `https://tu-backend.onrender.com`).

> **Nota:** Render crea un archivo `database.sqlite` en su propio entorno. Si quieres migrar datos, deberás subirlos manualmente.

---

## 2. Configurar el Frontend para usar el Backend en la nube

1. En la carpeta `frontend`, crea un archivo `.env` con el siguiente contenido:

```
REACT_APP_API_URL=https://tu-backend.onrender.com
```

2. Vuelve a generar el build de React:

```
cd frontend
npm run build
```

3. Copia el contenido de `frontend/build` a la raíz del proyecto (donde está `.nojekyll`).

4. Haz commit y push de los cambios a tu repositorio de GitHub.

---

## 3. Ver tu web en GitHub Pages

- Espera a que GitHub Pages despliegue tu web.
- Accede a la URL de tu página (ejemplo: `https://usuario.github.io/repositorio/`).
- El frontend se comunicará con el backend en la nube.

---

## 4. Notas importantes

- Si cambias la URL del backend, actualiza el archivo `.env` y vuelve a hacer build y push.
- El backend debe estar siempre online para que el login y las recetas funcionen.
- Si tienes dudas, consulta la documentación de Render o Railway.

---

¡Listo! Ahora tienes tu app fullstack desplegada y funcionando en la web 🚀 