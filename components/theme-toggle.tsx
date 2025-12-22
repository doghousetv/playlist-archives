"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-black/5 dark:bg-white/5" />
    )
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 backdrop-blur-sm border border-black/10 dark:border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-white" strokeWidth={2} />
      ) : (
        <Moon className="w-4 h-4 text-black" strokeWidth={2} />
      )}
    </motion.button>
  )
}

