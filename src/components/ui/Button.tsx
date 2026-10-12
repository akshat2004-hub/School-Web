import React from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { buttonPressProps } from "../../utils/motion";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  ariaLabel?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      ariaLabel,
      ...props
    },
    ref
  ) => {
    // Base Classes
    const baseStyles =
      "inline-flex items-center justify-center font-sans font-bold tracking-wide rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-brass-gold focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer select-none active:scale-[0.98]";

    // Size Variants
    const sizeStyles = {
      sm: "px-4 py-2 text-xs gap-1.5 shadow-xs",
      md: "px-6 py-2.5 text-sm gap-2 shadow-sm",
      lg: "px-7 py-3.5 text-base gap-2.5 shadow-md",
    };

    // Style Variants
    const variantStyles = {
      primary:
        "bg-gradient-to-r from-[#DFB743] via-[#F0CB56] to-[#C99D26] text-ink-navy font-bold shadow-[0_4px_14px_rgba(201,162,39,0.35)] hover:shadow-[0_6px_22px_rgba(201,162,39,0.5)] hover:brightness-105 border border-amber-200/60",
      secondary:
        "bg-gradient-to-r from-[#0A1931] via-[#142B54] to-[#1C3B6E] text-white font-medium shadow-[0_4px_14px_rgba(10,25,49,0.35)] hover:shadow-[0_6px_22px_rgba(14,35,70,0.5)] hover:brightness-110 border border-white/15 hover:border-brass-gold/50",
      outline:
        "bg-white/80 backdrop-blur-sm text-ink-navy border border-slate-300 hover:border-brass-gold hover:bg-gradient-to-r hover:from-amber-50/70 hover:to-white shadow-xs hover:shadow-md hover:text-ink-navy",
      ghost:
        "bg-transparent text-maroon hover:text-ink-navy hover:bg-amber-50/60 border-none shadow-none",
      danger:
        "bg-gradient-to-r from-[#8B1E2F] via-[#A0283E] to-[#751624] text-white font-medium shadow-[0_4px_14px_rgba(139,30,47,0.35)] hover:shadow-[0_6px_20px_rgba(139,30,47,0.5)] border border-red-400/30 hover:brightness-105",
    };

    const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
      fullWidth ? "w-full" : ""
    } ${className}`.trim();

    return (
      <motion.button
        ref={ref}
        {...buttonPressProps}
        className={combinedClassName}
        disabled={disabled || isLoading}
        aria-label={ariaLabel}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
