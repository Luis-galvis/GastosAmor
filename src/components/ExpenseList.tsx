import { Expense, useDeleteExpense } from "@/hooks/useExpenses";
import { getCategoryById } from "@/lib/categories";
import KittyCard from "./KittyCard";
import { Trash2 } from "lucide-react";

interface ExpenseListProps {
  expenses: Expense[];
}

const ExpenseList = ({ expenses }: ExpenseListProps) => {
  const deleteExpense = useDeleteExpense();

  const formatMoney = (num: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
    });
  };

  if (expenses.length === 0) {
    return (
      <KittyCard variant="muted" className="text-center py-8">
        <span className="text-4xl mb-2 block">🌸</span>
        <p className="text-muted-foreground">No hay gastos todavía mi amor 💕</p>
        <p className="text-sm text-muted-foreground">¡Toca el botón + para agregar uno, te amo!</p>
      </KittyCard>
    );
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => {
        const category = getCategoryById(expense.category);
        return (
          <KittyCard
            key={expense.id}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
              {category.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{expense.description}</p>
              <p className="text-xs text-muted-foreground">{formatDate(expense.created_at)}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-accent">{formatMoney(Number(expense.amount))}</p>
            </div>
            <button
              onClick={() => deleteExpense.mutate(expense.id)}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </KittyCard>
        );
      })}
    </div>
  );
};

export default ExpenseList;
