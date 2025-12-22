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
            transition={{ duration: 0.1 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              className="relative w-full max-w-lg bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-6 right-6 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Music className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-light tracking-tight text-black dark:text-white text-center mb-2">Add Playlist</h2>
              <p className="text-black/50 dark:text-white/50 text-center mb-8 text-sm">
                Paste a Spotify or Apple Music playlist link to add it to the archive
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="playlist-url" className="block text-xs font-medium text-black/60 dark:text-white/60 mb-2 uppercase tracking-wider">
                    Playlist URL
                  </label>
                  <div className="relative">
                    <input
                      id="playlist-url"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://open.spotify.com/playlist/..."
                      className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-lg text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-black/20 dark:focus:border-white/20 transition-colors"
                      required
                    />
                    <ExternalLink className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20 dark:text-white/20" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-white/90 text-white dark:text-black font-medium py-3.5 rounded-lg transition-all duration-300"
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
