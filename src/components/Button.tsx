// src/components/Button.tsx
import React from "react";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition";

  const variants = {
    primary: "bg-brand text-white hover:bg-brand/90 focus:ring-brand",
    secondary: "bg-secondary text-black hover:bg-secondary/90 focus:ring-secondary",
    outline:
      "border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 focus:ring-brand",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

