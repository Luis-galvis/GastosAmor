import { useMemo } from "react";
import { Expense } from "@/hooks/useExpenses";
import { getCategoryById, EXPENSE_CATEGORIES } from "@/lib/categories";
import KittyCard from "./KittyCard";
import { Lightbulb, TrendingUp, AlertTriangle, Sparkles } from "lucide-react";

interface SuggestionsProps {
  salary: number;
  totalSpent: number;
  expenses: Expense[];
  remaining: number;
}

const Suggestions = ({ salary, totalSpent, expenses, remaining }: SuggestionsProps) => {
  const suggestions = useMemo(() => {
    const tips: { icon: React.ReactNode; text: string; type: "success" | "warning" | "info" }[] = [];
    
    const percentSpent = (totalSpent / salary) * 100;
    const daysInMonth = 30;
    const today = new Date().getDate();
    const daysLeft = Math.max(daysInMonth - today, 1);
    const dailyBudget = remaining / daysLeft;

    // Categorize expenses
    const byCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
      return acc;
    }, {} as Record<string, number>);

    // Find highest spending category
    const topCategory = Object.entries(byCategory)
      .sort(([, a], [, b]) => b - a)[0];

    // Generate contextual tips
    if (remaining < 0) {
      tips.push({
        icon: <AlertTriangle className="w-5 h-5 text-destructive" />,
        text: "¡Ups! Te pasaste del presupuesto. Intenta no gastar más este mes 💪",
        type: "warning"
      });
    } else if (percentSpent > 80) {
      tips.push({
        icon: <AlertTriangle className="w-5 h-5 text-kitty-yellow" />,
        text: "Ya gastaste más del 80%. ¡Cuidado con los gastos! 🙀",
        type: "warning"
      });
    } else if (percentSpent < 30 && expenses.length > 0) {
      tips.push({
        icon: <Sparkles className="w-5 h-5 text-primary" />,
        text: "¡Vas súper bien! Llevas un excelente control 🌟",
        type: "success"
      });
    }

    if (dailyBudget > 0 && remaining > 0) {
      const formatMoney = (num: number) => 
        new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(num);
      
      tips.push({
        icon: <Lightbulb className="w-5 h-5 text-kitty-yellow" />,
        text: `Puedes gastar ${formatMoney(dailyBudget)} por día los próximos ${daysLeft} días 💕`,
        type: "info"
      });
    }

    if (topCategory && topCategory[1] > salary * 0.3) {
      const cat = getCategoryById(topCategory[0]);
      tips.push({
        icon: <TrendingUp className="w-5 h-5 text-accent" />,
        text: `${cat.emoji} ${cat.label.split(" ")[1]} es tu mayor gasto. ¿Puedes reducirlo?`,
        type: "info"
      });
    }

    if (expenses.length === 0) {
      tips.push({
        icon: <Sparkles className="w-5 h-5 text-primary" />,
        text: "¡Agrega tus gastos para recibir consejos personalizados! 📝",
        type: "info"
      });
    }

    return tips.slice(0, 3);
  }, [salary, totalSpent, expenses, remaining]);

  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-2">
      <h2 className="font-bold text-lg flex items-center gap-2">
        <span>💡</span> Consejos
      </h2>
      {suggestions.map((tip, index) => (
        <KittyCard 
          key={index} 
          variant="muted"
          className="flex items-start gap-3"
        >
          <div className="mt-0.5">{tip.icon}</div>
          <p className="text-sm text-foreground">{tip.text}</p>
        </KittyCard>
      ))}
    </div>
  );
};

export default Suggestions;
