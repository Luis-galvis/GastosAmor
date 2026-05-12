import { useRef } from "react";
import { X, Download, FileText, FileSpreadsheet } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import KittyButton from "./KittyButton";
import KittyCard from "./KittyCard";
import { Month } from "@/hooks/useMonth";
import { Expense } from "@/hooks/useExpenses";
import { Income } from "@/hooks/useIncomes";
import { EXPENSE_CATEGORIES, getCategoryById } from "@/lib/categories";

interface MonthlySummaryProps {
    month: Month;
    expenses: Expense[];
    incomes: Income[];
    onClose: () => void;
    onConfirmClose: () => void;
}

const MonthlySummary = ({ month, expenses, incomes, onClose, onConfirmClose }: MonthlySummaryProps) => {
    const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const totalIncome = incomes.reduce((sum, inc) => sum + Number(inc.amount), 0);
    const totalAvailable = Number(month.salary) + totalIncome;
    const remaining = totalAvailable - totalSpent;
    const savingsRate = totalAvailable > 0 ? (remaining / totalAvailable) * 100 : 0;

    // Prepare data for chart
    const expensesByCategory = EXPENSE_CATEGORIES.map(cat => {
        const amount = expenses
            .filter(e => e.category === cat.id)
            .reduce((sum, e) => sum + Number(e.amount), 0);
        return {
            name: cat.label,
            value: amount,
            color: cat.color,
            emoji: cat.emoji
        };
    }).filter(item => item.value > 0);

    const formatMoney = (num: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(num);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(255, 105, 180); // Hot pink
        doc.text("Resumen Mensual - Hello Kitty Budget", 105, 20, { align: "center" });

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Mes iniciado: ${new Date(month.started_at).toLocaleDateString()}`, 20, 40);

        // Summary Table
        autoTable(doc, {
            startY: 50,
            head: [['Concepto', 'Monto']],
            body: [
                ['Sueldo Base', formatMoney(Number(month.salary))],
                ['Ingresos Extra', formatMoney(totalIncome)],
                ['Total Disponible', formatMoney(totalAvailable)],
                ['Total Gastado', formatMoney(totalSpent)],
                ['Ahorro/Restante', formatMoney(remaining)],
            ],
            theme: 'grid',
            headStyles: { fillColor: [255, 182, 193] }, // Light pink
        });

        // Expenses Detail
        doc.text("Detalle de Gastos", 20, (doc as any).lastAutoTable.finalY + 20);

        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 30,
            head: [['Fecha', 'Descripción', 'Categoría', 'Monto']],
            body: expenses.map(e => [
                new Date(e.created_at).toLocaleDateString(),
                e.description,
                getCategoryById(e.category)?.label || e.category,
                formatMoney(Number(e.amount))
            ]),
            theme: 'striped',
            headStyles: { fillColor: [255, 105, 180] },
        });

        doc.save(`resumen-mes-${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    const handleExportExcel = () => {
        const wb = XLSX.utils.book_new();

        // Summary Sheet
        const summaryData = [
            ["Resumen Mensual", ""],
            ["Sueldo Base", Number(month.salary)],
            ["Ingresos Extra", totalIncome],
            ["Total Disponible", totalAvailable],
            ["Total Gastado", totalSpent],
            ["Restante", remaining],
        ];
        const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, wsSummary, "Resumen");

        // Expenses Sheet
        const expensesData = expenses.map(e => ({
            Fecha: new Date(e.created_at).toLocaleDateString(),
            Descripción: e.description,
            Categoría: getCategoryById(e.category)?.label || e.category,
            Monto: Number(e.amount)
        }));
        const wsExpenses = XLSX.utils.json_to_sheet(expensesData);
        XLSX.utils.book_append_sheet(wb, wsExpenses, "Gastos");

        XLSX.writeFile(wb, `resumen-mes-${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    return (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-background w-full max-w-2xl rounded-3xl shadow-kitty overflow-hidden flex flex-col my-auto animate-scale-in border-4 border-primary/20">

                {/* Header */}
                <div className="gradient-kitty p-6 text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                        <X className="w-5 h-5 text-primary-foreground" />
                    </button>
                    <h2 className="text-3xl font-bold text-primary-foreground mb-2">
                        ¡Resumen del Mes! 🎉
                    </h2>
                    <p className="text-primary-foreground/90">
                        Veamos cómo te fue mi princesa
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-secondary/30 p-4 rounded-2xl text-center">
                            <p className="text-xs text-muted-foreground mb-1">Ingresos Totales</p>
                            <p className="font-bold text-lg text-green-600">{formatMoney(totalAvailable)}</p>
                        </div>
                        <div className="bg-secondary/30 p-4 rounded-2xl text-center">
                            <p className="text-xs text-muted-foreground mb-1">Gastos Totales</p>
                            <p className="font-bold text-lg text-red-500">{formatMoney(totalSpent)}</p>
                        </div>
                        <div className="bg-secondary/30 p-4 rounded-2xl text-center">
                            <p className="text-xs text-muted-foreground mb-1">Ahorro</p>
                            <p className={`font-bold text-lg ${remaining >= 0 ? "text-primary" : "text-destructive"}`}>
                                {formatMoney(remaining)}
                            </p>
                        </div>
                        <div className="bg-secondary/30 p-4 rounded-2xl text-center">
                            <p className="text-xs text-muted-foreground mb-1">Tasa Ahorro</p>
                            <p className="font-bold text-lg text-purple-500">{savingsRate.toFixed(1)}%</p>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="h-64 w-full">
                        <h3 className="text-center font-bold mb-4">Gastos por Categoría</h3>
                        {expensesByCategory.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expensesByCategory}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {expensesByCategory.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => formatMoney(value)}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground">
                                No hay gastos para mostrar
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-3">
                            <KittyButton
                                variant="secondary"
                                onClick={handleExportPDF}
                                className="flex-1 gap-2"
                            >
                                <FileText className="w-4 h-4" /> PDF
                            </KittyButton>
                            <KittyButton
                                variant="secondary"
                                onClick={handleExportExcel}
                                className="flex-1 gap-2"
                            >
                                <FileSpreadsheet className="w-4 h-4" /> Excel
                            </KittyButton>
                        </div>

                        <div className="border-t pt-4 mt-2">
                            <p className="text-center text-sm text-muted-foreground mb-3">
                                ¿Lista para cerrar este mes y empezar uno nuevo?
                            </p>
                            <KittyButton
                                onClick={onConfirmClose}
                                className="w-full"
                                size="lg"
                                love
                            >
                                Sí, cerrar mes y descargar reporte 🎀
                            </KittyButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlySummary;
