"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import PlaylistGrid from "@/components/playlist-grid"
import AddPlaylistDialog from "@/components/add-playlist-dialog"

const WebGLBackground = dynamic(() => import("@/components/webgl-orbs"), {
  ssr: false,
})

export default function PlaylistArchive() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <WebGLBackground />

      {/* Gradient Overlay for better readability */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="px-6 py-8 md:py-12"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-3 tracking-tight text-balance">
                  Playlist Archive
                </h1>
                <p className="text-lg md:text-xl text-white/70 max-w-2xl text-pretty">
                  A public collection of curated music. Share your favorite playlists from Spotify and Apple Music.
                </p>
              </div>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-xl hover:shadow-2xl transition-all duration-300 gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Playlist
              </button>
            </div>
          </div>
        </motion.header>

        {/* Playlist Grid */}
        <PlaylistGrid />

        {/* Add Playlist Dialog */}
        <AddPlaylistDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </div>
    </div>
  )
}
