/**
 * Playlist data types
 */

export interface Playlist {
  id: number | string
  title: string
  gradient: string
  curator: string
  url?: string
  coverImage?: string
  trackCount?: number
  platform?: "spotify" | "apple-music"
}

export interface PlaylistCardProps {
  playlist: Playlist
  index: number
}

export interface PlaylistGridProps {
  initialCount?: number
  loadMoreCount?: number
}

