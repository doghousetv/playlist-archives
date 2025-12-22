import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  snap?: boolean
  fullHeight?: boolean
}

export function Section({ 
  children, 
  className, 
  snap = false, 
  fullHeight = false,
  ...props 
}: SectionProps) {
  return (
    <div
      className={cn(
        "relative w-screen",
        snap && "snap-start",
        fullHeight ? "h-screen" : "min-h-screen",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  overline?: string
}

export function SectionHeader({ children, overline, className, ...props }: SectionHeaderProps) {
  return (
    <div className={cn("mb-12", className)} {...props}>
      {overline && (
        <span className="block text-sm font-medium tracking-wider uppercase text-black/40 dark:text-white/40 mb-3">
          {overline}
        </span>
      )}
      {children}
    </div>
  )
}

interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  as?: "h1" | "h2" | "h3"
}

export function SectionTitle({ children, as: Component = "h2", className, ...props }: SectionTitleProps) {
  const sizes = {
    h1: "text-6xl md:text-8xl lg:text-[10rem]",
    h2: "text-4xl md:text-5xl",
    h3: "text-2xl md:text-3xl",
  }

  return React.createElement(
    Component,
    {
      className: cn(
        "font-light tracking-tight text-black dark:text-white",
        sizes[Component],
        className
      ),
      ...props,
    },
    children
  )
}

