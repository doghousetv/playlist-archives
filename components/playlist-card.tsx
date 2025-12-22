"use client"

import { motion } from "framer-motion"
import { Music2 } from "lucide-react"
import { ANIMATION } from "@/lib/constants"
import type { PlaylistCardProps } from "@/types/playlist"

export default function PlaylistCard({ playlist, index }: PlaylistCardProps) {
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
      className="group cursor-pointer"
    >
      <div className="relative bg-white dark:bg-neutral-800 rounded-xl p-3 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-all duration-500 hover:shadow-lg shadow-sm">
        {/* Playlist Cover */}
        <div
          className={`aspect-square rounded-lg bg-gradient-to-br ${playlist.gradient} relative overflow-hidden mb-3`}
        >
          {/* Overlay effect on hover */}
          <motion.div
            className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500"
            initial={false}
          />

          {/* Music icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0.2 }}
              whileHover={{ scale: 1, opacity: 0.4 }}
              transition={{ 
                duration: ANIMATION.DURATION.NORMAL, 
                ease: ANIMATION.EASING.SMOOTH 
              }}
            >
              <Music2 className="w-10 h-10 text-white/60" strokeWidth={1.5} />
            </motion.div>
          </div>

          {/* Subtle shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
            initial={{ x: "-100%", y: "-100%" }}
            whileHover={{ x: "100%", y: "100%" }}
            transition={{ 
              duration: ANIMATION.DURATION.VERY_SLOW, 
              ease: ANIMATION.EASING.EASE_IN_OUT 
            }}
          />
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
