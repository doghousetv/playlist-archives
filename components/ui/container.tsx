import * as React from "react"
import { cn } from "@/lib/utils"
import { LAYOUT } from "@/lib/constants"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(LAYOUT.MAX_WIDTH, "mx-auto", LAYOUT.PADDING.X, className)}
      {...props}
    >
      {children}
    </div>
  )
}

