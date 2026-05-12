export const EXPENSE_CATEGORIES = [
  { id: "comida", label: "🍔 Comida", emoji: "🍔", color: "#FF6B6B" },
  { id: "transporte", label: "🚗 Transporte", emoji: "🚗", color: "#4ECDC4" },
  { id: "compras", label: "🛍️ Compras", emoji: "🛍️", color: "#FFD93D" },
  { id: "entretenimiento", label: "🎬 Entretenimiento", emoji: "🎬", color: "#6C5CE7" },
  { id: "salud", label: "💊 Salud", emoji: "💊", color: "#FF8E72" },
  { id: "hogar", label: "🏠 Hogar", emoji: "🏠", color: "#A8E6CF" },
  { id: "servicios", label: "📱 Servicios", emoji: "📱", color: "#3D84A8" },
  { id: "otros", label: "✨ Otros", emoji: "✨", color: "#B8B8B8" },
] as const;

export type CategoryId = typeof EXPENSE_CATEGORIES[number]["id"];

export const getCategoryById = (id: string) => {
  return EXPENSE_CATEGORIES.find(cat => cat.id === id) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
};
