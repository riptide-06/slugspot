import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
};

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref
) {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition disabled:opacity-60";
  const variants = {
    primary: "bg-brand text-white hover:opacity-95",
    secondary: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
    ghost: "text-slate-700 hover:bg-slate-100",
  };
  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
  };
  return (
    <button ref={ref} className={clsx(base, variants[variant], sizes[size], className)} {...props} />
  );
});

export default Button;

