import { useState } from "react";
import { X, Delete, Equal } from "lucide-react";
import KittyButton from "./KittyButton";

interface CalculatorProps {
    onClose: () => void;
}

const Calculator = ({ onClose }: CalculatorProps) => {
    const [display, setDisplay] = useState("0");
    const [equation, setEquation] = useState("");

    const handleNumber = (num: string) => {
        setDisplay(display === "0" ? num : display + num);
        setEquation(equation + num);
    };

    const handleOperator = (op: string) => {
        setDisplay("0");
        setEquation(equation + " " + op + " ");
    };

    const handleEqual = () => {
        try {
            // eslint-disable-next-line no-eval
            const result = eval(equation);
            setDisplay(String(result));
            setEquation(String(result));
        } catch (error) {
            setDisplay("Error");
            setEquation("");
        }
    };

    const handleClear = () => {
        setDisplay("0");
        setEquation("");
    };

    return (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background w-full max-w-xs rounded-3xl p-6 animate-slide-up shadow-kitty border-4 border-secondary">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-primary">Calculadora 🎀</h3>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                <div className="bg-secondary/30 rounded-xl p-4 mb-4 text-right">
                    <div className="text-xs text-muted-foreground h-4">{equation}</div>
                    <div className="text-3xl font-bold text-foreground truncate">{display}</div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    <KittyButton variant="secondary" onClick={handleClear} className="col-span-2">AC</KittyButton>
                    <KittyButton variant="secondary" onClick={() => handleOperator("/")}>÷</KittyButton>
                    <KittyButton variant="secondary" onClick={() => handleOperator("*")}>×</KittyButton>

                    <KittyButton variant="ghost" onClick={() => handleNumber("7")}>7</KittyButton>
                    <KittyButton variant="ghost" onClick={() => handleNumber("8")}>8</KittyButton>
                    <KittyButton variant="ghost" onClick={() => handleNumber("9")}>9</KittyButton>
                    <KittyButton variant="secondary" onClick={() => handleOperator("-")}>-</KittyButton>

                    <KittyButton variant="ghost" onClick={() => handleNumber("4")}>4</KittyButton>
                    <KittyButton variant="ghost" onClick={() => handleNumber("5")}>5</KittyButton>
                    <KittyButton variant="ghost" onClick={() => handleNumber("6")}>6</KittyButton>
                    <KittyButton variant="secondary" onClick={() => handleOperator("+")}>+</KittyButton>

                    <KittyButton variant="ghost" onClick={() => handleNumber("1")}>1</KittyButton>
                    <KittyButton variant="ghost" onClick={() => handleNumber("2")}>2</KittyButton>
                    <KittyButton variant="ghost" onClick={() => handleNumber("3")}>3</KittyButton>
                    <KittyButton className="row-span-2 h-full" onClick={handleEqual} love>
                        <Equal className="w-6 h-6" />
                    </KittyButton>

                    <KittyButton variant="ghost" onClick={() => handleNumber("0")} className="col-span-2">0</KittyButton>
                    <KittyButton variant="ghost" onClick={() => handleNumber(".")}>.</KittyButton>
                </div>
            </div>
        </div>
    );
};

export default Calculator;
