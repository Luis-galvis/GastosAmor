import { useActiveMonth } from "@/hooks/useMonth";
import StartMonthView from "@/components/StartMonthView";
import Dashboard from "@/components/Dashboard";
import HelloKittyIcon from "@/components/HelloKittyIcon";

const Index = () => {
  const { data: activeMonth, isLoading } = useActiveMonth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <HelloKittyIcon className="w-20 h-20 animate-pulse-kitty" />
        <p className="text-muted-foreground font-semibold">Cargando... 💕</p>
      </div>
    );
  }

  if (!activeMonth) {
    return <StartMonthView />;
  }

  return <Dashboard month={activeMonth} />;
};

export default Index;
