import React from 'react';

function ExportImportScreen({ onExportPDF }) {
  return (
    <div className="screen active">
      <div className="screen-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2>Exportar Datos</h2>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h3>Exportar Lista de Recetas en PDF</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              Genera un PDF con todas tus recetas, incluyendo precios de venta y precios por unidad según la unidad de medida de cada receta.
            </p>
            <button className="btn-primary" onClick={onExportPDF} style={{ padding: '12px 24px', fontSize: '1rem' }}>
              📄 Exportar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportImportScreen;

