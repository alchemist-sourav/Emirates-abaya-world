"use client"

import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes } from "react"
import { forwardRef } from "react"

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "link"
export type ButtonSize = "sm" | "md" | "lg" | "xl"

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

    const variantClasses = {
      primary:
        "bg-peach text-white hover:bg-peach/90 hover:shadow-lg hover:-translate-y-0.5",
      secondary:
        "bg-black text-white hover:bg-black/90 hover:shadow-lg hover:-translate-y-0.5",
      outline:
        "border border-peach text-peach hover:bg-peach/10 hover:text-black",
      ghost: "text-peach hover:bg-peach/10",
      link: "underline-offset-4 hover:underline text-peach",
    }

    const sizeClasses = {
      sm: "h-9 px-4 text-sm",
      md: "h-12 px-6 text-base",
      lg: "h-14 px-8 text-lg",
      xl: "h-16 px-10 text-xl",
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"