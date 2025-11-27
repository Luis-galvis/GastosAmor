export const EXPENSE_CATEGORIES = [
  { id: "comida", label: "🍔 Comida", emoji: "🍔" },
  { id: "transporte", label: "🚗 Transporte", emoji: "🚗" },
  { id: "compras", label: "🛍️ Compras", emoji: "🛍️" },
  { id: "entretenimiento", label: "🎬 Entretenimiento", emoji: "🎬" },
  { id: "salud", label: "💊 Salud", emoji: "💊" },
  { id: "hogar", label: "🏠 Hogar", emoji: "🏠" },
  { id: "servicios", label: "📱 Servicios", emoji: "📱" },
  { id: "otros", label: "✨ Otros", emoji: "✨" },
] as const;

export type CategoryId = typeof EXPENSE_CATEGORIES[number]["id"];

export const getCategoryById = (id: string) => {
  return EXPENSE_CATEGORIES.find(cat => cat.id === id) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
};
