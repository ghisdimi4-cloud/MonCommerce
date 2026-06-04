import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "secondary" | "soft";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-gradient-to-b from-primary-500 to-primary-600 text-white shadow-sm shadow-primary-500/20 hover:from-primary-600 hover:to-primary-700 hover:shadow-primary-glow border border-primary-600/20 active:scale-[0.98]",
      secondary: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm active:scale-[0.98]",
      soft: "bg-primary-50 text-primary-700 hover:bg-primary-100 border border-transparent active:scale-[0.98]",
      outline: "border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700 active:scale-[0.98]",
      ghost: "hover:bg-slate-100 hover:text-slate-900 text-slate-600",
      link: "text-primary-600 underline-offset-4 hover:underline",
    };
    
    const sizes = {
      default: "h-11 px-5 py-2 rounded-xl",
      sm: "h-9 rounded-lg px-3 text-xs",
      lg: "h-14 rounded-2xl px-8 text-base",
      icon: "h-10 w-10 rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
