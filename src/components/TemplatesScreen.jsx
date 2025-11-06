import React, { useState } from 'react';

function TemplatesScreen({ onUseTemplate }) {
  const templates = [
    {
      name: 'Receta Básica',
      category: 'General',
      description: 'Plantilla básica para cualquier receta',
      defaultPortions: 1,
      defaultProfit: 30
    },
    {
      name: 'Postre',
      category: 'Postres',
      description: 'Plantilla optimizada para postres',
      defaultPortions: 8,
      defaultProfit: 40
    },
    {
      name: 'Panadería',
      category: 'Panadería',
      description: 'Plantilla para productos de panadería',
      defaultPortions: 12,
      defaultProfit: 35
    },
    {
      name: 'Bebida',
      category: 'Bebidas',
      description: 'Plantilla para bebidas',
      defaultPortions: 1,
      defaultProfit: 50
    }
  ];

  const handleUseTemplate = (template) => {
    if (onUseTemplate) {
      onUseTemplate(template);
    }
  };

  return (
    <div className="screen active">
      <div className="screen-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2>Plantillas de Recetas</h2>
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          Selecciona una plantilla para comenzar rápidamente con una nueva receta
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {templates.map((template, index) => (
            <div key={index} className="card" style={{ cursor: 'pointer' }}>
              <h3 style={{ marginTop: 0, color: '#6366F1' }}>{template.name}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>{template.description}</p>
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#F3F4F6', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.875rem' }}>
                  <strong>Categoría:</strong> {template.category}
                </div>
                <div style={{ fontSize: '0.875rem' }}>
                  <strong>Porciones:</strong> {template.defaultPortions}
                </div>
                <div style={{ fontSize: '0.875rem' }}>
                  <strong>Ganancia sugerida:</strong> {template.defaultProfit}%
                </div>
              </div>
              <button 
                className="btn-primary" 
                onClick={() => handleUseTemplate(template)}
                style={{ width: '100%', marginTop: '1rem' }}
              >
                Usar Plantilla
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TemplatesScreen;

