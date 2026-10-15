import Link from "next/link";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "navy" | "gold" | "outline" | "ghost" | "danger" | "outlineLight";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-brand-700 text-white hover:bg-brand-800 shadow-sm hover:shadow-md focus-visible:ring-brand-600",
  navy: "bg-navy-900 text-white hover:bg-navy-950 shadow-sm hover:shadow-md focus-visible:ring-navy-700",
  gold: "bg-gold-500 text-navy-950 hover:bg-gold-400 shadow-sm hover:shadow-md focus-visible:ring-gold-500",
  outline: "border-2 border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-white focus-visible:ring-brand-600",
  outlineLight: "border-2 border-white/80 text-white hover:bg-white hover:text-navy-900 focus-visible:ring-white",
  ghost: "text-navy-800 hover:bg-navy-100 focus-visible:ring-navy-300",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function buttonStyles(variant: Variant = "primary", size: Size = "md", className = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({ variant = "primary", size = "md", loading, className = "", children, disabled, ...props }: ButtonProps) {
  return (
    <button className={buttonStyles(variant, size, className)} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

interface LinkButtonProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function LinkButton({ href, variant = "primary", size = "md", className = "", children }: LinkButtonProps) {
  return (
    <Link href={href} className={buttonStyles(variant, size, className)}>
      {children}
    </Link>
  );
}
