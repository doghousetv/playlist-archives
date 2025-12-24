/**
 * Scraped playlist metadata
 */
export interface ScrapedPlaylistData {
  title: string | null
  curator: string | null
  coverImage: string | null
  gradient: string  // Always generated, never null
}

/**
 * Open Graph metadata extracted from HTML
 */
export interface OpenGraphData {
  title: string | null
  image: string | null
  description: string | null
}

