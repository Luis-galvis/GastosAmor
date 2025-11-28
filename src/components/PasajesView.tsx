import { useState } from "react";
import { X, Bus, Plus, Trash2, Edit2 } from "lucide-react";
import KittyButton from "./KittyButton";
import KittyCard from "./KittyCard";
import KittyInput from "./KittyInput";
import { useExpenses, useAddExpense, useDeleteExpense } from "@/hooks/useExpenses";
import { formatNumberWithDots, parseFormattedNumber } from "@/lib/formatNumber";
import { getRandomLoveMessage } from "@/lib/loveMessages";

interface PasajesViewProps {
    monthId: string;
    onClose: () => void;
}

const PasajesView = ({ monthId, onClose }: PasajesViewProps) => {
    const { data: expenses = [] } = useExpenses(monthId);
    const addExpense = useAddExpense();
    const deleteExpense = useDeleteExpense();

    const [dailyAmount, setDailyAmount] = useState("");
    const [budgetAmount, setBudgetAmount] = useState("");
    const [isEditingBudget, setIsEditingBudget] = useState(false);

    // Filter expenses for Pasajes
    const budgetExpense = expenses.find(e => e.category === "transport_budget");
    const dailyExpenses = expenses.filter(e => e.category === "transport_daily");

    const totalDailySpent = dailyExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const currentBudget = budgetExpense ? Number(budgetExpense.amount) : 0;
    const remaining = currentBudget - totalDailySpent;

    const handleAddDaily = () => {
        const amount = parseFormattedNumber(dailyAmount);
        if (amount > 0) {
            addExpense.mutate({
                month_id: monthId,
                description: "Pasajes del día",
                amount: amount,
                category: "transport_daily",
            });
            setDailyAmount("");
        }
    };

    const handleUpdateBudget = () => {
        const amount = parseFormattedNumber(budgetAmount);
        if (amount > 0) {
            // If budget exists, delete it first (simplest way to update for now)
            if (budgetExpense) {
                deleteExpense.mutate(budgetExpense.id);
            }

            // Add new budget
            addExpense.mutate({
                month_id: monthId,
                description: "Presupuesto Pasajes",
                amount: amount,
                category: "transport_budget",
            });

            setIsEditingBudget(false);
            setBudgetAmount("");
        }
    };

    const formatMoney = (num: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(num);
    };

    return (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto animate-slide-up">
            <div className="p-4 pb-24">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                            <Bus className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-bold text-xl">Pasajes 🚌</h2>
                            <p className="text-xs text-muted-foreground">Control de transporte</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X className="w-6 h-6 text-muted-foreground" />
                    </button>
                </div>

                {/* Budget Card */}
                <KittyCard variant="highlight" className="mb-6">
                    <div className="text-center space-y-2">
                        <p className="text-sm text-primary-foreground/80">Te queda para pasajes</p>
                        <p className={`text-4xl font-extrabold ${remaining < 0 ? "text-destructive" : "text-foreground"}`}>
                            {formatMoney(remaining)}
                        </p>
                        <div className="flex justify-center gap-4 text-xs mt-2">
                            <div className="flex items-center gap-1">
                                <span className="opacity-70">Presupuesto:</span>
                                <span className="font-bold ml-1">{formatMoney(currentBudget)}</span>
                                {budgetExpense && !isEditingBudget && (
                                    <button
                                        onClick={() => {
                                            setBudgetAmount(formatNumberWithDots(currentBudget.toString()));
                                            setIsEditingBudget(true);
                                        }}
                                        className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <Edit2 className="w-3 h-3 text-primary-foreground" />
                                    </button>
                                )}
                            </div>
                            <div>
                                <span className="opacity-70">Gastado:</span>
                                <span className="font-bold ml-1">{formatMoney(totalDailySpent)}</span>
                            </div>
                        </div>
                    </div>

                    {(!budgetExpense || isEditingBudget) && (
                        <div className="mt-4 pt-4 border-t border-primary/20 animate-fade-in">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-bold">
                                    {budgetExpense ? "Editar presupuesto" : "Establecer presupuesto mensual"}
                                </p>
                                {isEditingBudget && (
                                    <button
                                        onClick={() => setIsEditingBudget(false)}
                                        className="text-xs text-muted-foreground hover:text-foreground"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <KittyInput
                                    placeholder="Ej: 200.000"
                                    value={budgetAmount}
                                    onChange={(e) => setBudgetAmount(formatNumberWithDots(e.target.value))}
                                />
                                <KittyButton onClick={handleUpdateBudget} disabled={!budgetAmount}>
                                    Guardar
                                </KittyButton>
                            </div>
                        </div>
                    )}
                </KittyCard>

                {/* Add Daily Expense */}
                <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3">Agregar gasto del día 📝</h3>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <KittyInput
                                placeholder="¿Cuánto gastaste hoy?"
                                value={dailyAmount}
                                onChange={(e) => setDailyAmount(formatNumberWithDots(e.target.value))}
                            />
                        </div>
                        <KittyButton onClick={handleAddDaily} disabled={!dailyAmount} love>
                            <Plus className="w-5 h-5" />
                        </KittyButton>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 ml-1">
                        {getRandomLoveMessage()}
                    </p>
                </div>

                {/* History */}
                <div>
                    <h3 className="font-bold text-lg mb-3">Historial de pasajes 🕒</h3>
                    <div className="space-y-3">
                        {dailyExpenses.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No has agregado pasajes todavía mi amor 💕</p>
                            </div>
                        ) : (
                            dailyExpenses.map((expense) => (
                                <div key={expense.id} className="bg-card p-3 rounded-2xl shadow-sm flex items-center justify-between border border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-lg">
                                            🚌
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">{formatMoney(Number(expense.amount))}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(expense.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteExpense.mutate(expense.id)}
                                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasajesView;
