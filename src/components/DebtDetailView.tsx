import { useState } from "react";
import { X, Plus, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import KittyButton from "./KittyButton";
import KittyCard from "./KittyCard";
import KittyInput from "./KittyInput";
import { formatNumberWithDots, parseFormattedNumber } from "@/lib/formatNumber";
import { useDebtPayments, useAddDebtPayment, useUpdateDebtStatus, Debt } from "@/hooks/useDebts";

interface DebtDetailViewProps {
    debt: Debt;
    onClose: () => void;
}

const DebtDetailView = ({ debt, onClose }: DebtDetailViewProps) => {
    const [amount, setAmount] = useState("");
    const { data: payments = [] } = useDebtPayments(debt.id);
    const addPayment = useAddDebtPayment();
    const updateStatus = useUpdateDebtStatus();

    const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const remaining = Number(debt.total_amount) - totalPaid;
    const progress = Math.min((totalPaid / Number(debt.total_amount)) * 100, 100);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatNumberWithDots(e.target.value);
        setAmount(formatted);
    };

    const handleAddPayment = async () => {
        const amountNum = parseFormattedNumber(amount);
        if (amountNum > 0) {
            await addPayment.mutateAsync({
                debt_id: debt.id,
                amount: amountNum,
            });
            setAmount("");

            // Check if fully paid
            if (remaining - amountNum <= 0) {
                updateStatus.mutate({ id: debt.id, is_paid: true });
                onClose(); // Close details as it moves to paid list
            }
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
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background w-full max-w-md rounded-3xl shadow-kitty overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
                {/* Header */}
                <div className="gradient-kitty p-6 pb-8">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-primary-foreground">{debt.description}</h2>
                            <p className="text-primary-foreground/80 text-sm">Detalles de la deuda</p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                            <X className="w-5 h-5 text-primary-foreground" />
                        </button>
                    </div>

                    <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <p className="text-primary-foreground/80 text-xs uppercase tracking-wider">Total Deuda</p>
                                <p className="text-2xl font-bold text-primary-foreground">{formatMoney(Number(debt.total_amount))}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-primary-foreground/80 text-xs uppercase tracking-wider">Restante</p>
                                <p className="text-xl font-bold text-white">{formatMoney(remaining)}</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white transition-all duration-500 rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-right text-xs text-primary-foreground/80 mt-1">
                            {progress.toFixed(0)}% pagado
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Add Payment Form */}
                    <KittyCard className="bg-secondary/30 border-none">
                        <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Nuevo Abono
                        </h3>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <KittyInput
                                    placeholder="Monto a abonar..."
                                    value={amount}
                                    onChange={handleAmountChange}
                                    className="bg-background"
                                />
                            </div>
                            <KittyButton
                                onClick={handleAddPayment}
                                disabled={!amount || parseFormattedNumber(amount) <= 0 || addPayment.isPending}
                                love
                            >
                                Abonar
                            </KittyButton>
                        </div>
                    </KittyCard>

                    {/* History */}
                    <div>
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <span>📜</span> Historial de Pagos
                        </h3>
                        <div className="space-y-2">
                            {payments.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8 italic">
                                    Aún no hay abonos registrados
                                </p>
                            ) : (
                                payments.map((payment) => (
                                    <div key={payment.id} className="bg-card p-3 rounded-xl border border-border/50 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                <DollarSignIcon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{formatMoney(Number(payment.amount))}</p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(payment.date), "d 'de' MMMM, yyyy", { locale: es })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper icon component
const DollarSignIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

export default DebtDetailView;
