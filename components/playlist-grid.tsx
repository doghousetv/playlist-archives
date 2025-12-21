"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import PlaylistCard from "./playlist-card"

// Mock data - replace with real data later
const generateMockPlaylists = (count: number) => {
  const colors = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-yellow-500 to-amber-500",
    "from-indigo-500 to-purple-500",
    "from-rose-500 to-pink-500",
    "from-teal-500 to-blue-500",
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    title: `Playlist ${i + 1}`,
    gradient: colors[i % colors.length],
    curator: `User ${Math.floor(i / 4) + 1}`,
  }))
}

export default function PlaylistGrid() {
  const [playlists, setPlaylists] = useState(generateMockPlaylists(24))
  const [isLoading, setIsLoading] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)
  const isLoadingRef = useRef(false)

  // Infinite scroll - use ref to avoid dependency issues
  const loadMore = useCallback(() => {
    if (isLoadingRef.current) return

    isLoadingRef.current = true
    setIsLoading(true)
    
    setTimeout(() => {
      setPlaylists((prev) => {
        const newPlaylists = generateMockPlaylists(12).map((p) => ({
          ...p,
          id: p.id + prev.length,
        }))
        return [...prev, ...newPlaylists]
      })
      
      setIsLoading(false)
      isLoadingRef.current = false
    }, 1000)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingRef.current) {
          loadMore()
        }
      },
      { threshold: 0.1 },
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [loadMore])

  return (
    <div className="px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {playlists.map((playlist, index) => (
            <PlaylistCard key={playlist.id} playlist={playlist} index={index} />
          ))}
        </div>

        {/* Loading indicator */}
        <div ref={observerTarget} className="mt-12 flex justify-center">
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/50 text-sm">
              Loading more playlists...
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
