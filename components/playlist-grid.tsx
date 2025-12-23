"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import PlaylistCard from "./playlist-card"
import { LoadingSpinner } from "@/components/ui"
import { generateMockPlaylists } from "@/lib/utils"
import { PLAYLIST_GRADIENTS } from "@/lib/constants"
import type { Playlist } from "@/types/playlist"

export default function PlaylistGrid() {
  const [playlists, setPlaylists] = useState<Playlist[]>(
    generateMockPlaylists(24, PLAYLIST_GRADIENTS)
  )
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
        const newPlaylists = generateMockPlaylists(24, PLAYLIST_GRADIENTS).map((p) => ({
          ...p,
          id: Number(p.id) + prev.length,
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          {playlists.map((playlist, index) => {
            const relativeIndex = index % 24
            return (
              <PlaylistCard key={playlist.id} playlist={playlist} index={relativeIndex} />
            )
          })}
        </div>

        {/* Loading indicator */}
        <div ref={observerTarget} className="mt-16 flex justify-center">
          {isLoading && <LoadingSpinner text="Loading more playlists..." />}
        </div>
      </div>
    </div>
  )
}
