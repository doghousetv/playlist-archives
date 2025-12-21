"use client"

import { motion } from "framer-motion"
import { Music2 } from "lucide-react"

interface PlaylistCardProps {
  playlist: {
    id: number
    title: string
    gradient: string
    curator: string
  }
  index: number
}

export default function PlaylistCard({ playlist, index }: PlaylistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group cursor-pointer"
    >
      <div className="relative bg-white/[0.08] backdrop-blur-xl rounded-2xl p-3 border border-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.15)] shadow-[0_4px_16px_0_rgba(0,0,0,0.3)]">
        {/* Subtle inner shadow for depth */}
        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]" />

        {/* Playlist Cover */}
        <div
          className={`aspect-square rounded-xl bg-gradient-to-br ${playlist.gradient} relative overflow-hidden mb-3`}
        >
          {/* Overlay effect on hover */}
          <motion.div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

          {/* Music icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.3 }}
              whileHover={{ scale: 1, opacity: 0.6 }}
              transition={{ duration: 0.3 }}
            >
              <Music2 className="w-12 h-12 text-white/40" />
            </motion.div>
          </div>

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
            initial={{ x: "-100%", y: "-100%" }}
            whileHover={{ x: "100%", y: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </div>

        {/* Playlist Info */}
        <div className="space-y-1 relative z-10">
          <h3 className="font-semibold text-white text-sm md:text-base truncate">{playlist.title}</h3>
          <p className="text-xs text-white/50 truncate">by {playlist.curator}</p>
        </div>
      </div>
    </motion.div>
  )
}
