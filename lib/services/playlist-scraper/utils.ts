import type { OpenGraphData } from "./types"

/**
 * Decode HTML entities (including numeric entities like &#x27; and &#39;)
 */
export function decodeHtmlEntities(text: string): string {
  // First decode numeric entities (hex and decimal)
  let decoded = text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number.parseInt(dec, 10)))
  
  // Then decode named entities
  return decoded
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&nbsp;", " ")
    .replaceAll("&apos;", "'")
}

/**
 * Extract Open Graph metadata from HTML content
 */
export function extractOpenGraphData(html: string): OpenGraphData {
  // Try multiple patterns for Open Graph tags (with/without quotes, different spacing)
  const ogTitlePattern1 = /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i
  const ogTitlePattern2 = /<meta\s+content=["']([^"']+)["']\s+property=["']og:title["']/i
  const ogImagePattern1 = /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i
  const ogImagePattern2 = /<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i
  const ogDescriptionPattern1 = /<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i
  const ogDescriptionPattern2 = /<meta\s+content=["']([^"']+)["']\s+property=["']og:description["']/i
  const titlePattern = /<title[^>]*>([^<]+)<\/title>/i
  const metaTitlePattern = /<meta\s+name=["']title["']\s+content=["']([^"']+)["']/i

  const ogTitleMatch = ogTitlePattern1.exec(html) || ogTitlePattern2.exec(html)
  const ogImageMatch = ogImagePattern1.exec(html) || ogImagePattern2.exec(html)
  const ogDescriptionMatch = ogDescriptionPattern1.exec(html) || ogDescriptionPattern2.exec(html)
  const titleMatch = titlePattern.exec(html)
  const metaTitleMatch = metaTitlePattern.exec(html)

  const title = ogTitleMatch?.[1] || metaTitleMatch?.[1] || titleMatch?.[1] || null
  const image = ogImageMatch?.[1] || null
  const description = ogDescriptionMatch?.[1] || null

  return {
    title: title ? decodeHtmlEntities(title) : null,
    image: image ? decodeHtmlEntities(image) : null,
    description: description ? decodeHtmlEntities(description) : null,
  }
}

/**
 * Check if an image URL is a Spotify mosaic (auto-generated, not actual cover art)
 */
export function isMosaicImage(imageUrl: string | null): boolean {
  return imageUrl?.includes('mosaic.scdn.co') ?? false
}

/**
 * Check if an image URL is an Apple Music logo (fallback image, not actual cover art)
 */
export function isAppleMusicLogoImage(imageUrl: string | null): boolean {
  if (!imageUrl) return false
  // Check for Apple Music logo pattern: music.apple.com/assets/meta/apple-music-*.png
  return imageUrl.includes('music.apple.com/assets/meta/apple-music')
}

/**
 * Validate curator name (filter out false positives)
 */
export function isValidCurator(curator: string): boolean {
  const invalidNamesPattern = /^(Playlist|Spotify|Music|Songs|Tracks|Apple|saves|min|hr|hour|hours)$/i
  const startsWithNumberPattern = /^\d+/
  
  return (
    curator.length > 2 &&
    curator.length < 100 &&
    !invalidNamesPattern.exec(curator) &&
    !startsWithNumberPattern.exec(curator) && // Doesn't start with number
    !curator.includes("•")
  )
}

