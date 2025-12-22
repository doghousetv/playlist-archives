"use client"

import React, { useRef } from "react"
import { motion } from "framer-motion"
import { Music2 } from "lucide-react"
import ParallaxCard from "./ParallaxCard.js"

interface PlaylistCover3DProps {
  coverImage?: string
  gradient: string
  title: string
}

export default function PlaylistCover3D({
  coverImage,
  gradient,
  title,
}: PlaylistCover3DProps) {
  // Type guard: Check if coverImage exists and is not empty
  const hasCoverImage = coverImage && coverImage.trim().length > 0
  const containerRef = useRef<HTMLDivElement>(null)

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
          pointerEvents: "none",
        }}
      >
        <div style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
          <ParallaxCard
            isStatic={false}
            borderRadius="0.5rem"
            shineStrength={0.5}
            cursorPointer={true}
            containerRef={containerRef}
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            <div
              className={`w-full h-full bg-gradient-to-br ${gradient}`}
              style={{
                backgroundImage: hasCoverImage ? `url(${coverImage})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "background-image 0.4s ease-in-out",
                borderRadius: "0.5rem",
                position: "relative",
              }}
            >
              {/* Show music icon only when there's no cover image */}
              {!hasCoverImage && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Music2 className="w-10 h-10 text-white/60" strokeWidth={1.5} />
                </div>
              )}
            </div>
          </ParallaxCard>
        </div>
      </motion.div>
    </div>
  )
}

