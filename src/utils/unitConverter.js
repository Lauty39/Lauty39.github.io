// Conversión de unidades
export const convertUnit = (value, fromUnit, toUnit) => {
  const conversions = {
    // Peso
    'g': 1,
    'kg': 1000,
    'mg': 0.001,
    // Volumen
    'ml': 1,
    'l': 1000,
    'cl': 10,
    // Unidades
    'un': 1,
    'pz': 1,
  };

  const fromValue = conversions[fromUnit] || 1;
  const toValue = conversions[toUnit] || 1;

  // Si son del mismo tipo de unidad (peso/volumen)
  const isWeight = ['g', 'kg', 'mg'].includes(fromUnit) && ['g', 'kg', 'mg'].includes(toUnit);
  const isVolume = ['ml', 'l', 'cl'].includes(fromUnit) && ['ml', 'l', 'cl'].includes(toUnit);
  const isCount = ['un', 'pz'].includes(fromUnit) && ['un', 'pz'].includes(toUnit);

  if (isWeight || isVolume || isCount) {
    return (parseFloat(value) * fromValue) / toValue;
  }

  // Si no se puede convertir, devolver el valor original
  return parseFloat(value);
};

export const getUnitType = (unit) => {
  if (['g', 'kg', 'mg'].includes(unit)) return 'weight';
  if (['ml', 'l', 'cl'].includes(unit)) return 'volume';
  if (['un', 'pz'].includes(unit)) return 'count';
  return 'unknown';
};

export const canConvert = (fromUnit, toUnit) => {
  const fromType = getUnitType(fromUnit);
  const toType = getUnitType(toUnit);
  return fromType === toType && fromType !== 'unknown';
};

