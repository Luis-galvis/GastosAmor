import { Income } from "@/hooks/useIncomes";
import { useDeleteIncome } from "@/hooks/useIncomes";
import KittyCard from "./KittyCard";
import { Trash2 } from "lucide-react";
import { getRandomLoveMessage } from "@/lib/loveMessages";

interface IncomeListProps {
    incomes: Income[];
}

const IncomeList = ({ incomes }: IncomeListProps) => {
    const deleteIncome = useDeleteIncome();

    const formatMoney = (num: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(num);
    };

    if (incomes.length === 0) {
        return (
            <KittyCard variant="muted" className="text-center py-8">
                <p className="text-muted-foreground">No hay ingresos aún mi amor 💰</p>
                <p className="text-sm text-muted-foreground">¡Agrega ingresos extras cuando los recibas mi princesa! 💕</p>
                <p className="text-xs text-muted-foreground mt-2">{getRandomLoveMessage()}</p>
            </KittyCard>
        );
    }

    return (
        <div className="space-y-2">
            {incomes.map((income) => (
                <KittyCard key={income.id} className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="font-semibold text-foreground">{income.description}</p>
                        <p className="text-sm text-muted-foreground">
                            {new Date(income.created_at).toLocaleDateString("es-CO")}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="font-bold text-primary text-lg">
                            +{formatMoney(Number(income.amount))}
                        </p>
                        <button
                            onClick={() => deleteIncome.mutate(income.id)}
                            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                    </div>
                </KittyCard>
            ))}
        </div>
    );
};

export default IncomeList;
