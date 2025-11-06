# Software de Costos - React

Aplicación web para gestionar costos de recetas, migrada a React.

## Funcionalidades

- ✅ Gestión de recetas con nombre personalizado
- ✅ Tabla de costos (productos con cantidad adquirida, precio, cantidad utilizada, costo calculado automáticamente)
- ✅ Tabla de otros gastos (gasto mensual, diario, cantidad de platos, gasto diario por plato)
- ✅ Cálculo automático de totales
- ✅ Aplicación de porcentaje de ganancia
- ✅ Guardado de recetas en localStorage
- ✅ Lista de recetas guardadas
- ✅ Edición y eliminación de recetas
- ✅ Nueva receta desde la lista

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar en modo desarrollo:
```bash
npm run dev
```

3. Construir para producción:
```bash
npm run build
```

4. Vista previa de producción:
```bash
npm run preview
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── CostTable.jsx          # Tabla de costos
│   ├── ExpensesTable.jsx      # Tabla de gastos
│   ├── MainScreen.jsx         # Pantalla principal
│   └── RecipeListScreen.jsx   # Lista de recetas
├── App.jsx                    # Componente principal
├── App.css                    # Estilos de la aplicación
├── main.jsx                   # Punto de entrada
└── index.css                  # Estilos globales
```

## Tecnologías

- React 18
- Vite
- LocalStorage para persistencia de datos

## Notas

- Los datos se guardan en el localStorage del navegador
- El archivo original HTML se encuentra en `index-original.html`
