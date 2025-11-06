import React from 'react';
import './Header.css';

function Header({ currentSection, onSectionChange }) {
  return (
    <header className="app-header">
      <div className="header-container">
        <h1 className="header-title">Software de Costos</h1>
        <nav className="header-nav">
          <button 
            className={`nav-button ${currentSection === 'inicio' ? 'active' : ''}`}
            onClick={() => onSectionChange('inicio')}
            aria-label="Ir a inicio"
            aria-current={currentSection === 'inicio' ? 'page' : undefined}
          >
            Inicio
          </button>
          <button 
            className={`nav-button ${currentSection === 'recetas' ? 'active' : ''}`}
            onClick={() => onSectionChange('recetas')}
            aria-label="Ver recetas"
            aria-current={currentSection === 'recetas' ? 'page' : undefined}
          >
            Recetas
          </button>
          <button 
            className={`nav-button ${currentSection === 'crear-receta' ? 'active' : ''}`}
            onClick={() => onSectionChange('crear-receta')}
            aria-label="Crear nueva receta"
            aria-current={currentSection === 'crear-receta' ? 'page' : undefined}
          >
            Crear Receta
          </button>
          <button 
            className={`nav-button ${currentSection === 'productos' ? 'active' : ''}`}
            onClick={() => onSectionChange('productos')}
            aria-label="Gestionar productos"
            aria-current={currentSection === 'productos' ? 'page' : undefined}
          >
            Productos
          </button>
          <button 
            className={`nav-button ${currentSection === 'gastos' ? 'active' : ''}`}
            onClick={() => onSectionChange('gastos')}
            aria-label="Gestionar gastos"
            aria-current={currentSection === 'gastos' ? 'page' : undefined}
          >
            Gastos
          </button>
          <button 
            className={`nav-button ${currentSection === 'estadisticas' ? 'active' : ''}`}
            onClick={() => onSectionChange('estadisticas')}
            title="Estadísticas"
            aria-label="Ver estadísticas y reportes"
            aria-current={currentSection === 'estadisticas' ? 'page' : undefined}
          >
            📊 Estadísticas
          </button>
          <button 
            className={`nav-button ${currentSection === 'calculadora' ? 'active' : ''}`}
            onClick={() => onSectionChange('calculadora')}
            title="Calculadora"
            aria-label="Calculadora de conversiones"
            aria-current={currentSection === 'calculadora' ? 'page' : undefined}
          >
            🧮 Calculadora
          </button>
          <button 
            className={`nav-button ${currentSection === 'exportar-importar' ? 'active' : ''}`}
            onClick={() => onSectionChange('exportar-importar')}
            title="Exportar/Importar"
            aria-label="Exportar o importar datos"
            aria-current={currentSection === 'exportar-importar' ? 'page' : undefined}
          >
            💾 Datos
          </button>
          <button 
            className={`nav-button ${currentSection === 'configuracion' ? 'active' : ''}`}
            onClick={() => onSectionChange('configuracion')}
            title="Configuración"
            aria-label="Configuración de la aplicación"
            aria-current={currentSection === 'configuracion' ? 'page' : undefined}
          >
            ⚙️
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
