import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-slate-950 text-white shadow-[0_18px_30px_rgba(15,23,42,0.18)] hover:bg-slate-800",
  secondary:
    "bg-white/90 text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50",
  ghost:
    "bg-transparent text-slate-700 ring-1 ring-slate-200/80 hover:bg-white/80",
  danger:
    "bg-rose-600 text-white shadow-[0_18px_30px_rgba(225,29,72,0.18)] hover:bg-rose-500",
};

export function Button({
  children,
  className = "",
  fullWidth = false,
  loading = false,
  variant = "primary",
  disabled,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
        variantClasses[variant]
      } ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

