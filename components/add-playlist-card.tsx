"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { ANIMATION } from "@/lib/constants"
import { PlaylistCover3D } from "@/components/cover-art"

interface AddPlaylistCardProps {
  readonly index: number
  readonly onClick: () => void
}

export default function AddPlaylistCard({ index, onClick }: AddPlaylistCardProps) {
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
      whileTap={{
        scale: 0.9,
      }}
      className="group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      <div className="relative bg-white dark:bg-neutral-800 rounded-xl p-3 border-2 border-dashed border-black/10 dark:border-white/20 group-hover:border-black/20 dark:group-hover:border-white/30 transition-all duration-300 shadow-sm group-hover:shadow-lg dark:group-hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.15)]">
        {/* Playlist Cover - 3D Parallax */}
        <div className="aspect-square relative mb-3">
          <div className="w-full h-full rounded-lg">
            <PlaylistCover3D
              coverImage={undefined}
              gradient="from-neutral-200/20 to-neutral-300/20 dark:from-neutral-700/20 dark:to-neutral-600/20"
              isHovered={isHovered}
              mousePosition={mousePosition}
            >
              {/* Glassy overlay effect */}
              <div 
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              />
              {/* Plus Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Plus 
                  className="w-8 h-8 text-black/40 dark:text-white/40 group-hover:text-black/60 dark:group-hover:text-white/60 transition-colors" 
                  strokeWidth={2.5} 
                />
              </div>
            </PlaylistCover3D>
          </div>
        </div>

        {/* Playlist Info */}
        <div className="space-y-0.5 relative z-10">
          <h3 className="font-medium text-black dark:text-white text-sm truncate">Add Playlist</h3>
          <p className="text-xs text-black/40 dark:text-white/40 truncate">Click to add new</p>
        </div>
      </div>
    </motion.div>
  )
}

