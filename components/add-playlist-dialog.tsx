"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Music, ExternalLink } from "lucide-react"

interface AddPlaylistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddPlaylistDialog({ open, onOpenChange }: AddPlaylistDialogProps) {
  const [url, setUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle playlist submission
    console.log("Playlist URL:", url)
    setUrl("")
    onOpenChange(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-lg bg-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Icon */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Music className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-white text-center mb-3">Add Playlist</h2>
              <p className="text-white/60 text-center mb-8">
                Paste a Spotify or Apple Music playlist link to add it to the archive
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="playlist-url" className="block text-sm font-medium text-white/80 mb-2">
                    Playlist URL
                  </label>
                  <div className="relative">
                    <input
                      id="playlist-url"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://open.spotify.com/playlist/..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                      required
                    />
                    <ExternalLink className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6 rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-300"
                >
                  Add to Archive
                </button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
