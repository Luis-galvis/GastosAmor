import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface KittyCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "highlight" | "muted";
}

const KittyCard = forwardRef<HTMLDivElement, KittyCardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-card gradient-card shadow-card",
      highlight: "bg-card border-2 border-primary shadow-kitty",
      muted: "bg-muted",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-4 animate-slide-up",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

KittyCard.displayName = "KittyCard";

export default KittyCard;
