"use client"

import { motion } from "framer-motion"
import { ANIMATION } from "@/lib/constants"
import type { PlaylistCardProps } from "@/types/playlist"
import { PlaylistCover3D } from "@/components/cover-art"

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
        {/* Playlist Cover - 3D Parallax */}
        <div className="aspect-square relative mb-3">
          <div className="w-full h-full rounded-lg">
            <PlaylistCover3D
              coverImage={playlist.coverImage}
              gradient={playlist.gradient}
              title={playlist.title}
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
