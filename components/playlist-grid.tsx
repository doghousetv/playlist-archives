"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import PlaylistCard from "@/components/playlist-card"
import AddPlaylistCard from "@/components/add-playlist-card"
import { LoadingSpinner } from "@/components/ui"
import type { Playlist, PlaylistResponse } from "@/types/playlist"

interface PlaylistGridProps {
  readonly onAddPlaylistClick?: () => void
}

export default function PlaylistGrid({ onAddPlaylistClick }: PlaylistGridProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef<HTMLDivElement>(null)
  const isLoadingRef = useRef(false)

  // Fetch playlists from API
  const fetchPlaylists = useCallback(async (pageNum: number, append = false) => {
    if (isLoadingRef.current) return

    isLoadingRef.current = true
    if (append) {
      setIsLoadingMore(true)
    } else {
      setIsLoading(true)
    }

    try {
      const response = await fetch(`/api/playlists?page=${pageNum}&limit=24`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch playlists")
      }

      const data: PlaylistResponse = await response.json()
      
      if (append) {
        setPlaylists((prev) => [...prev, ...data.playlists])
      } else {
        setPlaylists(data.playlists)
      }
      
      setHasMore(data.pagination.hasMore)
      setPage(pageNum)
    } catch (error) {
      console.error("Error fetching playlists:", error)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
      isLoadingRef.current = false
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchPlaylists(1, false)
  }, [fetchPlaylists])

  // Infinite scroll - use ref to avoid dependency issues
  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingRef.current) return
    fetchPlaylists(page + 1, true)
  }, [hasMore, page, fetchPlaylists])

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

  if (isLoading && playlists.length === 0) {
    return (
      <div className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner text="Loading playlists..." />
          </div>
        </div>
      </div>
    )
  }

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
          {(playlists.length === 0 || (!hasMore && onAddPlaylistClick)) && onAddPlaylistClick && (
            <AddPlaylistCard 
              index={playlists.length % 24} 
              onClick={onAddPlaylistClick}
            />
          )}
        </div>

        {/* Loading indicator */}
        {hasMore && playlists.length > 0 && (
          <div ref={observerTarget} className="mt-16 flex justify-center">
            {isLoadingMore && <LoadingSpinner text="Loading more playlists..." />}
          </div>
        )}
      </div>
    </div>
  )
}
