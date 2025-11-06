import React, { useState } from 'react';
import { convertUnit, canConvert, getUnitType } from '../utils/unitConverter';

function CalculatorScreen() {
  const [conversionValue, setConversionValue] = useState('');
  const [fromUnit, setFromUnit] = useState('g');
  const [toUnit, setToUnit] = useState('kg');
  const [result, setResult] = useState(null);

  const units = {
    weight: ['g', 'kg', 'mg'],
    volume: ['ml', 'l', 'cl'],
    count: ['un', 'pz']
  };

  const handleConvert = () => {
    const value = parseFloat(conversionValue);
    if (isNaN(value)) {
      setResult(null);
      return;
    }

    if (canConvert(fromUnit, toUnit)) {
      const converted = convertUnit(value, fromUnit, toUnit);
      setResult(converted);
    } else {
      setResult('No se puede convertir entre estas unidades');
    }
  };

  const getAvailableUnits = (currentUnit) => {
    const type = getUnitType(currentUnit);
    return units[type] || [];
  };

  return (
    <div className="screen active">
      <div className="screen-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>Calculadora de Conversiones</h2>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Conversor de Unidades</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label>Valor: </label>
              <input
                type="number"
                step="0.01"
                value={conversionValue}
                onChange={(e) => {
                  setConversionValue(e.target.value);
                  setResult(null);
                }}
                placeholder="Ingrese el valor"
                style={{ width: '100%', maxWidth: '300px', padding: '10px', marginLeft: '10px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <label>De: </label>
                <select
                  value={fromUnit}
                  onChange={(e) => {
                    setFromUnit(e.target.value);
                    setResult(null);
                    // Actualizar unidades disponibles
                    const available = getAvailableUnits(e.target.value);
                    if (!available.includes(toUnit)) {
                      setToUnit(available[0] || 'g');
                    }
                  }}
                  style={{ padding: '10px', marginLeft: '10px' }}
                >
                  <optgroup label="Peso">
                    {units.weight.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Volumen">
                    {units.volume.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Unidades">
                    {units.count.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <span style={{ fontSize: '1.5rem' }}>→</span>
              </div>

              <div>
                <label>A: </label>
                <select
                  value={toUnit}
                  onChange={(e) => {
                    setToUnit(e.target.value);
                    setResult(null);
                  }}
                  style={{ padding: '10px', marginLeft: '10px' }}
                >
                  {getAvailableUnits(fromUnit).map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <button className="btn-primary" onClick={handleConvert} style={{ maxWidth: '200px' }}>
              Convertir
            </button>

            {result !== null && (
              <div style={{ 
                padding: '1rem', 
                background: '#E0E7FF', 
                borderRadius: '8px',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}>
                Resultado: {typeof result === 'number' ? result.toFixed(2) : result} {toUnit}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3>Calculadora de Porcentajes</h3>
          <PercentageCalculator />
        </div>
      </div>
    </div>
  );
}

function PercentageCalculator() {
  const [baseValue, setBaseValue] = useState('');
  const [percentage, setPercentage] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const base = parseFloat(baseValue);
    const perc = parseFloat(percentage);
    if (!isNaN(base) && !isNaN(perc)) {
      setResult({
        percentageOf: (base * perc / 100),
        totalWithPercentage: base * (1 + perc / 100),
        percentageOfTotal: base ? (perc / base * 100) : 0
      });
    } else {
      setResult(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label>Valor Base: </label>
        <input
          type="number"
          step="0.01"
          value={baseValue}
          onChange={(e) => {
            setBaseValue(e.target.value);
            setResult(null);
          }}
          placeholder="0.00"
          style={{ width: '100%', maxWidth: '300px', padding: '10px', marginLeft: '10px' }}
        />
      </div>

      <div>
        <label>Porcentaje: </label>
        <input
          type="number"
          step="0.01"
          value={percentage}
          onChange={(e) => {
            setPercentage(e.target.value);
            setResult(null);
          }}
          placeholder="0.00"
          style={{ width: '100%', maxWidth: '300px', padding: '10px', marginLeft: '10px' }}
        />
      </div>

      <button className="btn-primary" onClick={calculate} style={{ maxWidth: '200px' }}>
        Calcular
      </button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
          <div style={{ padding: '0.75rem', background: '#F3F4F6', borderRadius: '8px' }}>
            <strong>{percentage}% de {baseValue}:</strong> ${result.percentageOf.toFixed(2)}
          </div>
          <div style={{ padding: '0.75rem', background: '#F3F4F6', borderRadius: '8px' }}>
            <strong>{baseValue} + {percentage}%:</strong> ${result.totalWithPercentage.toFixed(2)}
          </div>
          <div style={{ padding: '0.75rem', background: '#F3F4F6', borderRadius: '8px' }}>
            <strong>{percentage} es:</strong> {result.percentageOfTotal.toFixed(2)}% de {baseValue}
          </div>
        </div>
      )}
    </div>
  );
}

export default CalculatorScreen;

