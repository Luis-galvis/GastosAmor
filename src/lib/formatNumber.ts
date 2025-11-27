/**
 * Formatea un número con separadores de miles (puntos)
 * Ejemplo: 1500000 -> "1.500.000"
 */
export const formatNumberWithDots = (value: string): string => {
    // Remover todo excepto números
    const numbers = value.replace(/\D/g, '');

    if (!numbers) return '';

    // Convertir a número y formatear con puntos
    return Number(numbers).toLocaleString('es-CO');
};

/**
 * Extrae el valor numérico de un string formateado
 * Ejemplo: "1.500.000" -> 1500000
 */
export const parseFormattedNumber = (value: string): number => {
    const numbers = value.replace(/\D/g, '');
    return numbers ? Number(numbers) : 0;
};
