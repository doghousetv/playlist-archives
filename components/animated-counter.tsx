"use client"

import {
  KeyframeOptions,
  animate,
  useInView,
  useIsomorphicLayoutEffect,
} from "framer-motion"
import { useRef } from "react"

type AnimatedCounterProps = {
  from: number
  to: number
  animationOptions?: KeyframeOptions
  padLength?: number
}

const AnimatedCounter = ({
  from,
  to,
  animationOptions,
  padLength = 7,
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useIsomorphicLayoutEffect(() => {
    const element = ref.current

    if (!element) return
    if (!inView) return

    // Set initial value with padding
    element.textContent = String(from).padStart(padLength, "0")

    // If reduced motion is enabled in system's preferences
    if (window.matchMedia("(prefers-reduced-motion)").matches) {
      element.textContent = String(to).padStart(padLength, "0")
      return
    }

    const controls = animate(from, to, {
      duration: 2,
      ease: "easeOut",
      ...animationOptions,
      onUpdate(value) {
        element.textContent = value.toFixed(0).padStart(padLength, "0")
      },
    })

    // Cancel on unmount
    return () => {
      controls.stop()
    }
  }, [ref, inView, from, to, animationOptions, padLength])

  return <span ref={ref} />
}

export default AnimatedCounter
