import React from 'react';
import { t } from '../utils/i18n';

function InicioScreen() {
  return (
    <div className="screen active">
      <div className="screen-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2>{t('app.inicio')} - Software de Costos</h2>
        
        <div style={{ marginTop: '2rem', lineHeight: '1.8' }}>
          <h3>¿Qué es este software?</h3>
          <p>
            Este software te permite gestionar de manera eficiente los costos de tus recetas, 
            ayudándote a calcular con precisión los gastos y ganancias de cada preparación.
          </p>

          <h3 style={{ marginTop: '2rem' }}>Características principales:</h3>
          <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
            <li><strong>Gestión de Productos:</strong> Guarda tus productos con sus precios y cantidades adquiridas para reutilizarlos en todas tus recetas.</li>
            <li><strong>Creación de Recetas:</strong> Crea recetas personalizadas seleccionando productos de tu inventario y calculando automáticamente los costos.</li>
            <li><strong>Cálculo Automático:</strong> El sistema calcula automáticamente los costos basándose en la cantidad utilizada de cada producto.</li>
            <li><strong>Gestión de Gastos:</strong> Incluye otros gastos mensuales y calcula su impacto en cada receta.</li>
            <li><strong>Cálculo de Ganancia:</strong> Aplica un porcentaje de ganancia deseado para determinar el precio de venta sugerido.</li>
            <li><strong>Almacenamiento Local:</strong> Todas tus recetas y productos se guardan localmente en tu navegador.</li>
          </ul>

          <h3 style={{ marginTop: '2rem' }}>Cómo empezar:</h3>
          <ol style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
            <li>Ve a la sección <strong>Productos</strong> y agrega los productos que utilizas frecuentemente.</li>
            <li>Ve a <strong>Crear Receta</strong> para comenzar a diseñar tus recetas.</li>
            <li>Selecciona los productos necesarios y la cantidad utilizada de cada uno.</li>
            <li>Agrega otros gastos si aplican y define el porcentaje de ganancia deseado.</li>
            <li>Guarda tu receta y accede a ella desde la sección <strong>Recetas</strong>.</li>
          </ol>

          <div style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            backgroundColor: '#e9f7e9', 
            borderRadius: '8px',
            borderLeft: '4px solid #4CAF50'
          }}>
            <p style={{ margin: 0, fontStyle: 'italic' }}>
              💡 <strong>Tip:</strong> Mantén actualizados los precios de tus productos para obtener cálculos precisos 
              en todas tus recetas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InicioScreen;
