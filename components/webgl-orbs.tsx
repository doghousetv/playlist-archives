"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

// Color palette matching the original design
const colors = [
  "hsl(270, 95%, 50%)", // Base purple
  "hsl(320, 95%, 50%)", // Complimentary pink
  "hsl(200, 95%, 50%)", // Complimentary cyan
]

// Generate random number in range
const random = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

// Orb component with floating animation
interface OrbProps {
  color: string
  size: number
  initialX: number
  initialY: number
  duration: number
  animationValues: {
    x: number[]
    y: number[]
    scale: number[]
  }
}

const Orb = ({ color, size, initialX, initialY, duration, animationValues }: OrbProps) => {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, ${color}80 40%, transparent 70%)`,
        left: initialX,
        top: initialY,
        opacity: 0.9,
      }}
      animate={{
        x: animationValues.x,
        y: animationValues.y,
        scale: animationValues.scale,
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

const Background = () => {
  const [orbs, setOrbs] = useState<Array<{
    color: string
    size: number
    x: number
    y: number
    duration: number
    animationValues: {
      x: number[]
      y: number[]
      scale: number[]
    }
  }>>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Mark as mounted to prevent hydration issues
    setIsMounted(true)

    // Set CSS custom properties for the color palette
    document.documentElement.style.setProperty("--hue", "270")
    document.documentElement.style.setProperty("--hue-complimentary1", "320")
    document.documentElement.style.setProperty("--hue-complimentary2", "200")

    // Generate orbs positioned in upper-right area (matching original design)
    const generateOrbs = () => {
      if (typeof window === "undefined") return

      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const maxDist = windowWidth < 1000 ? windowWidth / 3 : windowWidth / 5
      const originX = windowWidth / 1.25
      const originY = windowWidth < 1000 ? windowHeight : windowHeight / 1.375

      const newOrbs = Array.from({ length: 10 }, () => {
        const color = colors[Math.floor(random(0, colors.length))]
        const size = random(windowHeight / 6, windowHeight / 3)
        const x = random(originX - maxDist, originX + maxDist) - size / 2
        const y = random(originY - maxDist, originY + maxDist) - size / 2
        const duration = random(15, 25)
        
        // Pre-calculate animation values to avoid recalculating on each render
        const animationValues = {
          x: [0, random(-150, 150), random(-150, 150), 0],
          y: [0, random(-150, 150), random(-150, 150), 0],
          scale: [1, random(0.7, 1.3), random(0.7, 1.3), 1],
        }

        return { color, size, x, y, duration, animationValues }
      })

      setOrbs(newOrbs)
    }

    generateOrbs()

    // Regenerate on resize with debounce
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        generateOrbs()
      }, 250)
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [])

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return null
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-20">
      {orbs.map((orb, index) => (
        <Orb
          key={index}
          color={orb.color}
          size={orb.size}
          initialX={orb.x}
          initialY={orb.y}
          duration={orb.duration}
          animationValues={orb.animationValues}
        />
      ))}
    </div>
  )
}

export default Background
