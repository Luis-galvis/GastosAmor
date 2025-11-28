import { useState } from "react";
import HelloKittyIcon from "./HelloKittyIcon";
import Calculator from "./Calculator";
import PasajesView from "./PasajesView";
import DebtsView from "./DebtsView";
import MonthlySummary from "./MonthlySummary";
import KittyButton from "./KittyButton";
import KittyCard from "./KittyCard";
import KittyInput from "./KittyInput";
import ExpenseList from "./ExpenseList";
import IncomeList from "./IncomeList";
import Suggestions from "./Suggestions";
import { getRandomLoveMessage } from "@/lib/loveMessages";
import { useActiveMonth, useEndMonth, Month } from "@/hooks/useMonth";
import { useExpenses, useAddExpense } from "@/hooks/useExpenses";
import { useIncomes, useAddIncome } from "@/hooks/useIncomes";
import { EXPENSE_CATEGORIES, getCategoryById } from "@/lib/categories";
import { formatNumberWithDots, parseFormattedNumber } from "@/lib/formatNumber";
import { Plus, X, TrendingDown, Wallet, PiggyBank, DollarSign, CreditCard } from "lucide-react";

interface DashboardProps {
  month: Month;
}

const Dashboard = ({ month }: DashboardProps) => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showPasajes, setShowPasajes] = useState(false);
  const [showDebts, setShowDebts] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showEndMonthConfirm, setShowEndMonthConfirm] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("otros");
  const [incomeDescription, setIncomeDescription] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");

  const { data: expenses = [] } = useExpenses(month.id);
  const { data: incomes = [] } = useIncomes(month.id);
  const addExpense = useAddExpense();
  const addIncome = useAddIncome();
  const endMonth = useEndMonth();

  const totalSpent = expenses
    .filter(e => e.category !== "transport_daily")
    .reduce((sum, exp) => sum + Number(exp.amount), 0);
  const totalIncome = incomes.reduce((sum, inc) => sum + Number(inc.amount), 0);
  const remaining = Number(month.salary) + totalIncome - totalSpent;
  const totalAvailable = Number(month.salary) + totalIncome;
  const percentSpent = totalAvailable > 0 ? (totalSpent / totalAvailable) * 100 : 0;

  const loveMessage = getRandomLoveMessage();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberWithDots(e.target.value);
    setAmount(formatted);
  };

  const handleIncomeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberWithDots(e.target.value);
    setIncomeAmount(formatted);
  };

  const handleAddExpense = () => {
    const amountNum = parseFormattedNumber(amount);
    if (description && amountNum > 0) {
      addExpense.mutate({
        month_id: month.id,
        description,
        amount: amountNum,
        category,
      });
      setDescription("");
      setAmount("");
      setCategory("otros");
      setShowAddExpense(false);
    }
  };

  const handleAddIncome = () => {
    const amountNum = parseFormattedNumber(incomeAmount);
    if (incomeDescription && amountNum > 0) {
      addIncome.mutate({
        month_id: month.id,
        description: incomeDescription,
        amount: amountNum,
      });
      setIncomeDescription("");
      setIncomeAmount("");
      setShowAddIncome(false);
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
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-kitty p-4 pb-8 rounded-b-3xl shadow-kitty">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HelloKittyIcon className="w-10 h-10" />
            <div>
              <span className="text-primary-foreground font-bold text-lg">Mi Mesada 💕</span>
              <p className="text-xs text-primary-foreground/80">{loveMessage}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <KittyButton
              variant="ghost"
              size="sm"
              onClick={() => setShowCalculator(true)}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              🔢
            </KittyButton>
            <KittyButton
              variant="ghost"
              size="sm"
              onClick={() => setShowEndMonthConfirm(true)}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              love
            >
              Finalizar mes
            </KittyButton>
          </div>
        </div>

        {/* Balance Card */}
        <KittyCard className="mt-4">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground text-sm">Te queda mi amor</p>
            <p className={`text-3xl font-extrabold ${remaining < 0 ? "text-destructive" : "text-foreground"}`}>
              {formatMoney(remaining)}
            </p>

            {/* Progress bar */}
            <div className="w-full h-3 bg-secondary rounded-full overflow-hidden mt-4">
              <div
                className={`h-full transition-all duration-500 rounded-full ${percentSpent > 80 ? "bg-destructive" : percentSpent > 50 ? "bg-kitty-yellow" : "bg-primary"
                  }`}
                style={{ width: `${Math.min(percentSpent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {percentSpent.toFixed(0)}% gastado
            </p>
          </div>
        </KittyCard>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-4 grid grid-cols-2 gap-3">
        <KittyCard className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Sueldo</p>
            <p className="font-bold text-sm">{formatMoney(Number(month.salary))}</p>
          </div>
        </KittyCard>

        <KittyCard className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Gastado</p>
            <p className="font-bold text-sm">{formatMoney(totalSpent)}</p>
          </div>
        </KittyCard>

        <button onClick={() => setShowPasajes(true)} className="col-span-1">
          <KittyCard variant="highlight" className="flex items-center justify-between w-full h-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center">
                <span className="text-xl">🚌</span>
              </div>
              <div className="text-left">
                <p className="text-xs text-primary-foreground/80">Pasajes</p>
                <p className="font-bold text-sm text-foreground">Ver</p>
              </div>
            </div>
          </KittyCard>
        </button>

        <button onClick={() => setShowDebts(true)} className="col-span-1">
          <KittyCard variant="highlight" className="flex items-center justify-between w-full h-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs text-primary-foreground/80">Deudas</p>
                <p className="font-bold text-sm text-foreground">Ver</p>
              </div>
            </div>
          </KittyCard>
        </button>
      </div>

      {/* Suggestions */}
      <div className="px-4 mt-4">
        <Suggestions
          salary={Number(month.salary)}
          totalSpent={totalSpent}
          expenses={expenses}
          remaining={remaining}
        />
      </div>

      {/* Expenses List */}
      <div className="px-4 mt-4">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
          <span>📝</span> Mis gastos
        </h2>
        <ExpenseList expenses={expenses.filter(e => e.category !== "transport_daily")} />
      </div>

      {/* Incomes List */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <span>💰</span> Ingresos extras
          </h2>
          <KittyButton
            size="sm"
            onClick={() => setShowAddIncome(true)}
            className="text-sm"
          >
            + Agregar
          </KittyButton>
        </div>
        <IncomeList incomes={incomes} />
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-foreground/50 flex items-end justify-center z-50">
          <div className="bg-background w-full max-w-md rounded-t-3xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold">Agregar gasto mi amor 💸</h3>
                <p className="text-sm text-muted-foreground">{getRandomLoveMessage()}</p>
              </div>
              <button onClick={() => setShowAddExpense(false)} className="p-2">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <KittyInput
                label="¿En qué gastaste?"
                placeholder="Ej: Almuerzo"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <KittyInput
                label="¿Cuánto?"
                type="text"
                placeholder="Ej: 15.000"
                value={amount}
                onChange={handleAmountChange}
              />

              <div className="space-y-2">
                <label className="text-sm font-semibold">Categoría</label>
                <div className="grid grid-cols-4 gap-2">
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 rounded-xl text-2xl transition-all ${category === cat.id
                        ? "bg-primary text-primary-foreground scale-110 shadow-kitty"
                        : "bg-secondary hover:bg-secondary/80"
                        }`}
                    >
                      {cat.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <KittyButton
                onClick={handleAddExpense}
                disabled={!description || !amount || parseFormattedNumber(amount) <= 0}
                className="w-full"
                size="lg"
                love
              >
                Agregar mi princesa 🎀
              </KittyButton>
            </div>
          </div>
        </div>
      )}

      {/* Add Income Modal */}
      {showAddIncome && (
        <div className="fixed inset-0 bg-foreground/50 flex items-end justify-center z-50">
          <div className="bg-background w-full max-w-md rounded-t-3xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold">Agregar ingreso mi amor 💰</h3>
                <p className="text-sm text-muted-foreground">{getRandomLoveMessage()}</p>
              </div>
              <button onClick={() => setShowAddIncome(false)} className="p-2">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <KittyInput
                label="¿De dónde vino?"
                placeholder="Ej: Venta, regalo"
                value={incomeDescription}
                onChange={(e) => setIncomeDescription(e.target.value)}
              />

              <KittyInput
                label="¿Cuánto?"
                type="text"
                placeholder="Ej: 20.000"
                value={incomeAmount}
                onChange={handleIncomeAmountChange}
              />

              <KittyButton
                onClick={handleAddIncome}
                disabled={!incomeDescription || !incomeAmount || parseFormattedNumber(incomeAmount) <= 0}
                className="w-full"
                size="lg"
                love
              >
                Agregar ingreso mi vida 💞
              </KittyButton>
            </div>
          </div>
        </div>
      )}

      {/* End Month Confirmation Modal */}
      {showEndMonthConfirm && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background w-full max-w-md rounded-3xl p-6 animate-slide-up shadow-kitty">
            <div className="text-center space-y-4">
              <div className="text-5xl mb-2">💖</div>
              <h3 className="text-xl font-bold text-foreground">
                ¿Estás segura de cerrar el mes, mi princesa?
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Recuerda que se te pierden las cuentas. Solo ciérralo si ya se acabó el mes y te pagaron de nuevo 💸✨
              </p>

              <div className="flex gap-3 pt-4">
                <KittyButton
                  variant="secondary"
                  onClick={() => setShowEndMonthConfirm(false)}
                  className="flex-1"
                  size="lg"
                >
                  Cancelar
                </KittyButton>
                <KittyButton
                  onClick={() => {
                    setShowEndMonthConfirm(false);
                    setShowSummary(true);
                  }}
                  className="flex-1"
                  size="lg"
                >
                  Sí, terminar mes 🎀
                </KittyButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Summary Modal */}
      {showSummary && (
        <MonthlySummary
          month={month}
          expenses={expenses}
          incomes={incomes}
          onClose={() => setShowSummary(false)}
          onConfirmClose={() => {
            endMonth.mutate(month.id);
            setShowSummary(false);
          }}
        />
      )}

      {/* Calculator Modal */}
      {showCalculator && <Calculator onClose={() => setShowCalculator(false)} />}

      {/* Pasajes Modal */}
      {showPasajes && <PasajesView monthId={month.id} onClose={() => setShowPasajes(false)} />}

      {/* Debts Modal */}
      {showDebts && <DebtsView onClose={() => setShowDebts(false)} />}

      {/* FAB */}
      <button
        onClick={() => setShowAddExpense(true)}
        className="fixed bottom-6 right-6 w-16 h-16 gradient-kitty rounded-full shadow-kitty flex items-center justify-center active:scale-95 transition-transform"
      >
        <Plus className="w-8 h-8 text-primary-foreground" />
      </button>
    </div>
  );
};

export default Dashboard;
