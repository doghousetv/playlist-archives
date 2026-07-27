import { prisma } from "@/lib/prisma"
import { extractPlatformFromUrl } from "@/lib/utils"
import { scrapePlaylistMetadata } from "./playlist-scraper"

export interface CreatePlaylistInput {
  url: string
  latitude?: number | null
  longitude?: number | null
  city?: string | null
  country?: string | null
}

export interface CreatePlaylistResult {
  success: boolean
  playlist?: {
    id: number
    url: string
    platform: string
    title: string | null
    curator: string | null
    coverImage: string | null
    gradient: string | null
    latitude: number | null
    longitude: number | null
    city: string | null
    country: string | null
  }
  error?: string
}

/**
 * Create a new playlist entry with initial data (url and platform)
 * Scraping happens asynchronously via API route
 */
export async function createPlaylistEntry(
  input: CreatePlaylistInput
): Promise<CreatePlaylistResult> {
  try {
    const platform = extractPlatformFromUrl(input.url)
    
    if (!platform) {
      return {
        success: false,
        error: "Unsupported platform. Only Spotify and Apple Music are supported.",
      }
    }

    // Check if playlist already exists
    const existing = await prisma.playlist.findFirst({
      where: { url: input.url },
    })

    if (existing) {
      return {
        success: false,
        error: "Playlist already exists",
      }
    }

    // Create playlist with URL, platform, and (best-effort) submitter geolocation
    const playlist = await prisma.playlist.create({
      data: {
        url: input.url,
        platform,
        latitude: input.latitude ?? null,
        longitude: input.longitude ?? null,
        city: input.city ?? null,
        country: input.country ?? null,
      },
    })

    return {
      success: true,
      playlist: {
        id: playlist.id,
        url: playlist.url,
        platform: playlist.platform,
        title: playlist.title,
        curator: playlist.curator,
        coverImage: playlist.coverImage,
        gradient: playlist.gradient,
        latitude: playlist.latitude,
        longitude: playlist.longitude,
        city: playlist.city,
        country: playlist.country,
      },
    }
  } catch (error) {
    console.error("Error creating playlist entry:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create playlist",
    }
  }
}

/**
 * Update playlist with scraped metadata
 */
export async function updatePlaylistMetadata(
  playlistId: number,
  metadata: {
    title?: string | null
    curator?: string | null
    coverImage?: string | null
    gradient?: string  // Always provided, never null
  }
): Promise<void> {
  await prisma.playlist.update({
    where: { id: playlistId },
    data: {
      title: metadata.title ?? undefined,
      curator: metadata.curator ?? undefined,
      coverImage: metadata.coverImage ?? undefined,
      gradient: metadata.gradient,  // Always set
    },
  })
}

/**
 * Scrape and update playlist metadata
 */
export async function scrapeAndUpdatePlaylist(playlistId: number): Promise<void> {
  const playlist = await prisma.playlist.findUnique({
    where: { id: playlistId },
  })

  if (!playlist) {
    throw new Error("Playlist not found")
  }

  const metadata = await scrapePlaylistMetadata(playlist.url)
  await updatePlaylistMetadata(playlistId, metadata)
}

