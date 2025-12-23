"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ANIMATION } from "@/lib/constants"
import type { PlaylistCardProps } from "@/types/playlist"
import { PlaylistCover3D } from "@/components/cover-art"

export default function PlaylistCard({ playlist, index }: PlaylistCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ pageX: 0, pageY: 0 })

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ pageX: e.pageX, pageY: e.pageY })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: ANIMATION.DURATION.SLOW,
        delay: index * ANIMATION.DELAY.STAGGER_SHORT,
        ease: ANIMATION.EASING.SMOOTH,
      }}
      whileHover={{
        scale: 1.05,
      }}
      className="group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div className="relative bg-white dark:bg-neutral-800 rounded-xl p-3 border border-black/5 dark:border-white/20 group-hover:border-black/10 dark:group-hover:border-white/30 transition-all duration-300 shadow-sm group-hover:shadow-lg dark:group-hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.15)]">
        {/* Playlist Cover - 3D Parallax */}
        <div className="aspect-square relative mb-3">
          <div className="w-full h-full rounded-lg">
            <PlaylistCover3D
              coverImage={playlist.coverImage}
              gradient={playlist.gradient}
              isHovered={isHovered}
              mousePosition={mousePosition}
            />
          </div>
        </div>

        {/* Playlist Info */}
        <div className="space-y-0.5 relative z-10">
          <h3 className="font-medium text-black dark:text-white text-sm truncate">{playlist.title}</h3>
          <p className="text-xs text-black/40 dark:text-white/40 truncate">by {playlist.curator}</p>
        </div>
      </div>
    </motion.div>
  )
}
