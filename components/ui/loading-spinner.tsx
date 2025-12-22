import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  text?: string
}

export function LoadingSpinner({ className, text = "Loading..." }: LoadingSpinnerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("flex items-center gap-2 text-black/30 dark:text-white/30 text-sm", className)}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-4 h-4 border-2 border-black/20 dark:border-white/20 border-t-black/40 dark:border-t-white/40 rounded-full"
      />
      {text}
    </motion.div>
  )
}

