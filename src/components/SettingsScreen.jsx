import React, { useState } from 'react';
import { getLanguage, setLanguage, t } from '../utils/i18n';
import './SettingsScreen.css';

function SettingsScreen({ onThemeChange, currentTheme }) {
  const [lang, setLang] = useState(getLanguage());

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setLang(newLang);
    window.location.reload(); // Recargar para aplicar idioma
  };

  return (
    <div className="screen active">
      <div className="screen-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2>{t('app.configuracion')}</h2>

        <div className="settings-section">
          <h3>{t('app.modoOscuro')}</h3>
          <div className="settings-toggle">
            <label>
              <input
                type="checkbox"
                checked={currentTheme === 'dark'}
                onChange={(e) => onThemeChange(e.target.checked ? 'dark' : 'light')}
              />
              <span>{currentTheme === 'dark' ? t('app.modoOscuro') : t('app.modoClaro')}</span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>{t('app.idioma')}</h3>
          <div className="settings-options">
            <button
              className={lang === 'es' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => handleLanguageChange('es')}
            >
              Español
            </button>
            <button
              className={lang === 'en' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => handleLanguageChange('en')}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsScreen;

