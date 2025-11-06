# Instrucciones para iniciar el servidor

## Si el localhost no carga:

1. **Abre una nueva terminal PowerShell** en el directorio del proyecto:
   ```
   cd "c:\Users\lauta\Desktop\Mis proyectos\App costo - copia-"
   ```

2. **Ejecuta el servidor:**
   ```
   npm run dev
   ```

3. **Deberías ver un mensaje como:**
   ```
   VITE v5.x.x  ready in xxx ms
   
   ➜  Local:   http://localhost:5173/
   ➜  Network: http://192.168.x.x:5173/
   ```

4. **Abre tu navegador** y ve a: `http://localhost:5173`

## Si sigue sin funcionar:

1. **Verifica que no haya otro proceso usando el puerto 5173:**
   - Cierra cualquier otra terminal que pueda estar ejecutando el servidor
   - O usa un puerto diferente: `npm run dev -- --port 3000`

2. **Limpia e reinstala las dependencias:**
   ```
   rm -r node_modules
   npm install
   npm run dev
   ```

3. **Verifica que Node.js esté instalado:**
   ```
   node --version
   ```
   (Debería ser v16 o superior)

## Solución rápida alternativa:

Si necesitas usar otro puerto, edita `vite.config.js` y agrega:
```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
})
```

