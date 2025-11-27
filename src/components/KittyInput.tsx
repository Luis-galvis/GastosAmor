import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface KittyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

const KittyInput = forwardRef<HTMLInputElement, KittyInputProps>(
  ({ className, label, icon, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-semibold text-foreground">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-2xl border-2 border-input bg-card px-4 py-3 text-base font-nunito",
              "placeholder:text-muted-foreground",
              "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
              "transition-all duration-200",
              icon && "pl-12",
              className
            )}
            {...props}
          />
        </div>
      </div>
    );
  }
);

KittyInput.displayName = "KittyInput";

export default KittyInput;
