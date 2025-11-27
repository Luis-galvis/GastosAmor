import { useState } from "react";
import HelloKittyIcon from "./HelloKittyIcon";
import KittyButton from "./KittyButton";
import KittyCard from "./KittyCard";
import KittyInput from "./KittyInput";
import { useStartMonth } from "@/hooks/useMonth";
import { formatNumberWithDots, parseFormattedNumber } from "@/lib/formatNumber";
import { DollarSign } from "lucide-react";

const StartMonthView = () => {
  const [salary, setSalary] = useState("");
  const startMonth = useStartMonth();

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberWithDots(e.target.value);
    setSalary(formatted);
  };

  const handleStart = () => {
    const salaryNum = parseFormattedNumber(salary);
    if (salaryNum > 0) {
      startMonth.mutate(salaryNum);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <HelloKittyIcon className="w-24 h-24 animate-bounce-soft" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">
            ¡Hola! 💕
          </h1>
          <p className="text-muted-foreground">
            Empecemos un nuevo mes de ahorro
          </p>
        </div>

        {/* Form */}
        <KittyCard variant="highlight" className="space-y-6">
          <div className="text-center">
            <span className="text-4xl">💰</span>
            <h2 className="text-lg font-bold text-foreground mt-2">
              ¿Cuánto ganaste este mes?
            </h2>
          </div>

          <KittyInput
            label="Tu sueldo"
            type="text"
            placeholder="Ej: 1.500.000"
            value={salary}
            onChange={handleSalaryChange}
            icon={<DollarSign className="w-5 h-5" />}
          />

          <KittyButton
            onClick={handleStart}
            disabled={!salary || parseFormattedNumber(salary) <= 0 || startMonth.isPending}
            className="w-full"
            size="lg"
          >
            {startMonth.isPending ? "Iniciando..." : "¡Empezar mes! 🎀"}
          </KittyButton>
        </KittyCard>

        {/* Decorative elements */}
        <div className="flex justify-center gap-2 text-2xl">
          <span className="animate-bounce-soft" style={{ animationDelay: "0ms" }}>🌸</span>
          <span className="animate-bounce-soft" style={{ animationDelay: "200ms" }}>💖</span>
          <span className="animate-bounce-soft" style={{ animationDelay: "400ms" }}>🎀</span>
        </div>
      </div>
    </div>
  );
};

export default StartMonthView;
