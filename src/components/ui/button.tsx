import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "brand-gradient-bg text-white shadow-lg shadow-brand-purple/20 hover:opacity-90",
  secondary:
    "bg-card border border-border text-foreground hover:bg-card-hover",
  ghost: "text-foreground hover:bg-card",
  danger: "bg-red-600/90 text-white hover:bg-red-600",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }
>(({ className, variant = "primary", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";
