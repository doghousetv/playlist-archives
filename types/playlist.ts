export interface Playlist {
  id: number
  title: string
  gradient: string
  curator: string
  url?: string
  coverImage?: string
  trackCount?: number
  platform?: "spotify" | "apple-music"
  latitude?: number | null
  longitude?: number | null
  city?: string | null
  country?: string | null
}

export interface PlaylistLocation {
  id: number
  title: string
  curator: string
  url: string
  coverImage?: string
  gradient: string
  platform: "spotify" | "apple-music"
  latitude: number
  longitude: number
  city?: string
  country?: string
}

export interface PlaylistLocationsResponse {
  locations: PlaylistLocation[]
  count: number
}

export interface PlaylistResponse {
  playlists: Playlist[]
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
    hasMore: boolean
  }
}

export interface PlaylistCardProps {
  playlist: Playlist
  index: number
}

export interface PlaylistGridProps {
  initialCount?: number
  loadMoreCount?: number
}

