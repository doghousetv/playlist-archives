import { extractPlatformFromUrl, generateRandomGradient } from "@/lib/utils"
import { extractSpotifyCurator } from "./spotify-extractor"
import { extractAppleMusicCurator, cleanAppleMusicTitle } from "./apple-music-extractor"
import { extractOpenGraphData, isMosaicImage, isAppleMusicLogoImage, decodeHtmlEntities } from "./utils"
import type { ScrapedPlaylistData } from "./types"

/**
 * Fetch HTML content from a URL
 */
async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch playlist: ${response.statusText}`)
  }

  return response.text()
}

/**
 * Process cover image: filter out mosaic images and Apple Music logos, always generate gradient
 * Gradients are persisted for consistency and fallback display
 */
function processCoverImage(imageUrl: string | null): {
  coverImage: string | null
  gradient: string
} {
  const isMosaic = isMosaicImage(imageUrl)
  const isAppleMusicLogo = isAppleMusicLogoImage(imageUrl)
  const coverImage = (isMosaic || isAppleMusicLogo) ? null : imageUrl
  // Always generate a gradient for persistence (used as fallback or overlay)
  const gradient = generateRandomGradient()

  return { coverImage, gradient }
}

/**
 * Scrape playlist metadata from a URL
 */
export async function scrapePlaylistMetadata(
  url: string
): Promise<ScrapedPlaylistData> {
  const platform = extractPlatformFromUrl(url)
  
  if (!platform) {
    throw new Error("Unsupported platform")
  }

  try {
    // Fetch HTML content
    const html = await fetchHtml(url)
    const ogData = extractOpenGraphData(html)

    // Extract curator based on platform
    let curator: string | null = null
    if (platform === "spotify") {
      curator = extractSpotifyCurator(html)
    } else if (platform === "apple-music") {
      curator = extractAppleMusicCurator(html, url)
    }

    // Decode HTML entities in curator if found
    if (curator) {
      curator = decodeHtmlEntities(curator)
    }

    // Clean title: Remove "by <curator> on Apple Music" pattern for Apple Music
    let cleanedTitle = ogData.title
    if (platform === "apple-music" && cleanedTitle) {
      cleanedTitle = cleanAppleMusicTitle(cleanedTitle, curator)
    }

    // Process cover image (filter mosaics, generate gradient)
    const { coverImage, gradient } = processCoverImage(ogData.image)

    return {
      title: cleanedTitle,
      curator,
      coverImage,
      gradient,
    }
  } catch (error) {
    console.error("Error scraping playlist:", error)
    throw new Error(`Failed to scrape playlist metadata: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

