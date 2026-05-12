import { useState } from "react";
import HelloKittyIcon from "./HelloKittyIcon";
import KittyButton from "./KittyButton";
import KittyInput from "./KittyInput";

const PASSWORD = "teamo";

interface PasswordGateProps {
  children: React.ReactNode;
}

const PasswordGate = ({ children }: PasswordGateProps) => {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem("kitty-unlocked") === "true";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === PASSWORD) {
      localStorage.setItem("kitty-unlocked", "true");
      setIsUnlocked(true);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className={`w-full max-w-sm ${shake ? "animate-shake" : ""}`}>
        <div className="flex flex-col items-center gap-4 mb-8">
          <HelloKittyIcon className="w-24 h-24 animate-pulse-kitty" />
          <h1 className="text-2xl font-bold text-primary">💕 Mi App de Gastos 💕</h1>
          <p className="text-muted-foreground text-center">
            Ingresa la clave secreta para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <KittyInput
            type="password"
            placeholder="Clave secreta..."
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className={error ? "border-destructive" : ""}
          />
          {error && (
            <p className="text-destructive text-sm text-center">
              ¡Clave incorrecta! 😿
            </p>
          )}
          <KittyButton type="submit" className="w-full">
            Entrar 💖
          </KittyButton>
        </form>
      </div>
    </div>
  );
};

export default PasswordGate;
