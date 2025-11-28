import { useState } from "react";
import { X, Plus, CheckCircle2, CircleDollarSign } from "lucide-react";
import KittyButton from "./KittyButton";
import KittyCard from "./KittyCard";
import KittyInput from "./KittyInput";
import DebtDetailView from "./DebtDetailView";
import { formatNumberWithDots, parseFormattedNumber } from "@/lib/formatNumber";
import { useDebts, useAddDebt, Debt } from "@/hooks/useDebts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DebtsViewProps {
    onClose: () => void;
}

const DebtsView = ({ onClose }: DebtsViewProps) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);

    // Form state
    const [description, setDescription] = useState("");
    const [totalAmount, setTotalAmount] = useState("");

    const { data: debts = [] } = useDebts();
    const addDebt = useAddDebt();

    const activeDebts = debts.filter(d => !d.is_paid);
    const paidDebts = debts.filter(d => d.is_paid);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatNumberWithDots(e.target.value);
        setTotalAmount(formatted);
    };

    const handleAddDebt = async () => {
        const amountNum = parseFormattedNumber(totalAmount);
        if (description && amountNum > 0) {
            await addDebt.mutateAsync({
                description,
                total_amount: amountNum,
            });
            setDescription("");
            setTotalAmount("");
            setShowAddForm(false);
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
                <div className="gradient-kitty p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-primary-foreground flex items-center gap-2">
                            <span>💳</span> Mis Deudas
                        </h2>
                        <p className="text-primary-foreground/80 text-sm">Administra tus pagos mi amor</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                        <X className="w-5 h-5 text-primary-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <Tabs defaultValue="active" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="active">Activas 😟</TabsTrigger>
                            <TabsTrigger value="paid">Pagadas 🎉</TabsTrigger>
                        </TabsList>

                        <TabsContent value="active" className="space-y-4">
                            {/* Add Button */}
                            {!showAddForm ? (
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="w-full p-4 rounded-2xl border-2 border-dashed border-primary/30 flex items-center justify-center gap-2 text-primary hover:bg-primary/5 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span className="font-bold">Nueva Deuda</span>
                                </button>
                            ) : (
                                <KittyCard className="animate-slide-up">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold">Nueva Deuda</h3>
                                        <button onClick={() => setShowAddForm(false)}>
                                            <X className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <KittyInput
                                            label="Nombre de la deuda"
                                            placeholder="Ej: Tarjeta Crédito"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                        <KittyInput
                                            label="Monto Total"
                                            placeholder="Ej: 1.000.000"
                                            value={totalAmount}
                                            onChange={handleAmountChange}
                                        />
                                        <KittyButton
                                            onClick={handleAddDebt}
                                            disabled={!description || !totalAmount || parseFormattedNumber(totalAmount) <= 0}
                                            className="w-full"
                                            love
                                        >
                                            Guardar Deuda
                                        </KittyButton>
                                    </div>
                                </KittyCard>
                            )}

                            {/* Active Debts List */}
                            <div className="space-y-3">
                                {activeDebts.length === 0 && !showAddForm && (
                                    <div className="text-center py-10 text-muted-foreground">
                                        <p>¡No tienes deudas activas! 🥳</p>
                                        <p className="text-sm">Eres la mejor administrando el dinero</p>
                                    </div>
                                )}
                                {activeDebts.map((debt) => (
                                    <button
                                        key={debt.id}
                                        onClick={() => setSelectedDebt(debt)}
                                        className="w-full text-left transition-transform active:scale-98"
                                    >
                                        <KittyCard className="flex items-center justify-between group hover:border-primary/50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                                                    <CircleDollarSign className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground">{debt.description}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Total: {formatMoney(Number(debt.total_amount))}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                                                    Ver detalles
                                                </span>
                                            </div>
                                        </KittyCard>
                                    </button>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="paid" className="space-y-3">
                            {paidDebts.length === 0 && (
                                <div className="text-center py-10 text-muted-foreground">
                                    <p>Aún no hay deudas pagadas</p>
                                    <p className="text-sm">¡Tú puedes mi amor! 💪</p>
                                </div>
                            )}
                            {paidDebts.map((debt) => (
                                <KittyCard key={debt.id} className="opacity-75 bg-secondary/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground line-through decoration-primary/50">{debt.description}</p>
                                            <p className="text-sm text-green-600 font-medium">
                                                ¡Pagada totalmente!
                                            </p>
                                        </div>
                                    </div>
                                </KittyCard>
                            ))}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedDebt && (
                <DebtDetailView
                    debt={selectedDebt}
                    onClose={() => setSelectedDebt(null)}
                />
            )}
        </div>
    );
};

export default DebtsView;
