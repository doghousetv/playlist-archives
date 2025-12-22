import * as React from "react"
import { motion } from "framer-motion"
import { ANIMATION } from "@/lib/constants"

interface AnimatedTextProps {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div"
}

export function AnimatedText({ 
  children, 
  className, 
  delay = 0,
  as: Component = "div" 
}: AnimatedTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: ANIMATION.DURATION.VERY_SLOW, 
        delay, 
        ease: ANIMATION.EASING.SMOOTH 
      }}
    >
      {React.createElement(Component, { className }, children)}
    </motion.div>
  )
}

interface AnimatedTextInViewProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function AnimatedTextInView({ 
  children, 
  className, 
  delay = 0 
}: AnimatedTextInViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: ANIMATION.DURATION.SLOW, 
        delay, 
        ease: ANIMATION.EASING.SMOOTH 
      }}
    >
      <div className={className}>{children}</div>
    </motion.div>
  )
}

