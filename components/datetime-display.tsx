"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { ANIMATION } from "@/lib/constants"

const DateTimeDisplay = () => {
  const [currentDate, setCurrentDate] = useState<string>("")
  const [currentTime, setCurrentTime] = useState<string>("")

  useEffect(() => {
    const updateDateTime = () => {
      const date = new Date()

      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })

      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short",
      })

      setCurrentDate(formattedDate)
      setCurrentTime(formattedTime)
    }

    updateDateTime()

    const interval = setInterval(updateDateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: ANIMATION.DURATION.SLOW,
        delay: ANIMATION.DELAY.SHORT,
        ease: ANIMATION.EASING.SMOOTH,
      }}
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-mono tracking-[0.15em] text-black/80 dark:text-white/80">
          {currentDate}
        </span>
        <span className="text-xs font-mono tracking-[0.15em] text-black/40 dark:text-white/40">
          {currentTime}
        </span>
      </div>
    </motion.div>
  )
}

export default DateTimeDisplay
