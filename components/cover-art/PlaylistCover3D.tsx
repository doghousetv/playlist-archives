"use client"

import React, { useRef } from "react"
import { motion } from "framer-motion"
import { Music2 } from "lucide-react"
import ParallaxCard from "./ParallaxCard.js"

interface PlaylistCover3DProps {
  readonly coverImage?: string
  readonly gradient: string
  readonly isHovered?: boolean
  readonly mousePosition?: { pageX: number; pageY: number }
  readonly platform?: "spotify" | "apple-music"
  readonly children?: React.ReactNode
}

export default function PlaylistCover3D({
  coverImage,
  gradient,
  isHovered = false,
  mousePosition,
  platform,
  children,
}: PlaylistCover3DProps) {
  const hasCoverImage = coverImage && coverImage.trim().length > 0
  const containerRef = useRef<HTMLDivElement>(null)
  const backgroundSize = platform === "apple-music" ? "280%" : "cover"

  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex items-center justify-center" 
      style={{ pointerEvents: "auto" }}
    >
      <motion.div
        className="w-[85%] h-[85%]"
        animate={{
          rotateX: [0, 3, -3, 0],
          y: [0, -6, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse",
        }}
        style={{
          transformStyle: "preserve-3d",
          pointerEvents: "auto",
        }}
      >
        <div style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
          <ParallaxCard
            isStatic={false}
            borderRadius="0.5rem"
            shineStrength={0.5}
            cursorPointer={true}
            isHovered={isHovered}
            mousePosition={mousePosition}
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            <div
              className={`bg-gradient-to-br ${gradient}`}
              style={{
                borderRadius: "0.5rem",
                overflow: "hidden",
                width: "100%",
                height: "100%",
                position: "relative",
                backgroundImage: hasCoverImage ? `url(${coverImage})` : undefined,
                backgroundSize: backgroundSize,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minWidth: "100%",
                minHeight: "100%",
              }}
            >
              {!hasCoverImage && !children && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Music2 className="w-10 h-10 text-white/60" strokeWidth={1.5} />
                </div>
              )}
              {children}
            </div>
          </ParallaxCard>
        </div>
      </motion.div>
    </div>
  )
}

