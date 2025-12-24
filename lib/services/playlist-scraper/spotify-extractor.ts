import { decodeHtmlEntities, isValidCurator } from "./utils"

/**
 * Extract curator/owner information from Spotify HTML
 */
export function extractSpotifyCurator(html: string): string | null {
  // Method 1: Check title tag for "Playlist Name by Curator" format
  const curatorFromTitle = extractCuratorFromTitle(html)
  if (curatorFromTitle) return curatorFromTitle

  // Method 2: Check description for various curator patterns
  const curatorFromDescription = extractCuratorFromDescription(html)
  if (curatorFromDescription) return curatorFromDescription

  // Method 3: Look for Spotify's embedded JSON data
  const curatorFromEmbeddedJson = extractCuratorFromEmbeddedJson(html)
  if (curatorFromEmbeddedJson) return curatorFromEmbeddedJson

  // Method 4: Check for JSON-LD structured data
  const curatorFromJsonLd = extractCuratorFromJsonLd(html)
  if (curatorFromJsonLd) return curatorFromJsonLd

  // Method 5: Look for owner in meta tags
  const curatorFromMeta = extractCuratorFromMetaTags(html)
  if (curatorFromMeta) return curatorFromMeta

  return null
}

/**
 * Extract curator from title tag
 */
function extractCuratorFromTitle(html: string): string | null {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  if (!titleMatch?.[1]) return null

  const title = decodeHtmlEntities(titleMatch[1])
  const titleByMatch = title.match(/(?:by|from)\s+([^•\n·•\r|]+?)(?:\s*[-|•]|\s*on Spotify|$)/i)
  
  if (titleByMatch?.[1]) {
    const curator = titleByMatch[1].trim()
    if (isValidCurator(curator)) {
      return curator
    }
  }
  
  return null
}

/**
 * Extract curator from description meta tag
 */
function extractCuratorFromDescription(html: string): string | null {
  const descriptionMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
    html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:description["']/i)
  
  if (!descriptionMatch?.[1]) return null

  const description = decodeHtmlEntities(descriptionMatch[1])
  
  // Spotify description format is often: "Playlist description • by Curator Name • X saves • Y min"
  const patterns = [
    /(?:by|from|curated by|created by)\s+([^•\n·•\r]+?)(?:\s*•|\s*\n|$)/i,
    /(?:by|from|curated by|created by)\s+([^•\n·•\r]+)/i,
    /\s+by\s+([A-Z][^•\n]+?)(?:\s*•|$)/i, // "by Curator Name •"
    /•\s*by\s+([^•\n]+?)(?:\s*•|$)/i, // "• by Curator Name •"
    /([A-Z][a-zA-Z\s]{2,30}?)(?:\s*•|\s*\n|$)/, // Capitalized name before bullet
  ]
  
  for (const pattern of patterns) {
    const match = description.match(pattern)
    if (match?.[1]) {
      const curator = match[1].trim().replace(/\s+/g, " ")
      if (isValidCurator(curator)) {
        return curator
      }
    }
  }
  
  return null
}

/**
 * Extract curator from embedded JSON data (window.__initial_state__ or similar)
 */
function extractCuratorFromEmbeddedJson(html: string): string | null {
  const embeddedJsonPatterns = [
    /window\.__initial_state__\s*=\s*({.+?});/is,
    /<script[^>]*id=["']initial-state["'][^>]*>(.*?)<\/script>/is,
    /<script[^>]*type=["']application\/json["'][^>]*data-testid=["']initial-state["'][^>]*>(.*?)<\/script>/is,
  ]
  
  for (const pattern of embeddedJsonPatterns) {
    const match = html.match(pattern)
    if (!match?.[1]) continue

    try {
      const data = JSON.parse(match[1])
      const owner = findOwnerInObject(data)
      if (owner) return decodeHtmlEntities(owner)
    } catch {
      // Try regex extraction from JSON string
      const ownerMatches = [
        match[1].match(/"owner":\s*\{[^}]*"displayName":\s*"([^"]+)"/i),
        match[1].match(/"displayName":\s*"([^"]+)"[^}]*"owner"/i),
        match[1].match(/"owner":\s*\{[^}]*"name":\s*"([^"]+)"/i),
      ]
      
      for (const ownerMatch of ownerMatches) {
        if (ownerMatch?.[1]) {
          return decodeHtmlEntities(ownerMatch[1])
        }
      }
    }
  }
  
  return null
}

/**
 * Recursively search for owner information in nested objects
 */
function findOwnerInObject(obj: any): string | null {
  if (typeof obj !== 'object' || obj === null) return null
  
  if (obj.owner?.display_name) return obj.owner.display_name
  if (obj.creator?.display_name) return obj.creator.display_name
  if (obj.author?.display_name) return obj.author.display_name
  if (obj.displayName) return obj.displayName
  
  // Recursively search nested objects
  for (const key in obj) {
    if (key.includes('owner') || key.includes('creator') || key.includes('author')) {
      const result = findOwnerInObject(obj[key])
      if (result) return result
    }
  }
  
  return null
}

/**
 * Extract curator from JSON-LD structured data
 */
function extractCuratorFromJsonLd(html: string): string | null {
  const jsonLdMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis)
  
  for (const match of jsonLdMatches) {
    try {
      const jsonLd = JSON.parse(match[1])
      if (jsonLd.byArtist?.name) return decodeHtmlEntities(jsonLd.byArtist.name)
      if (jsonLd.creator?.name) return decodeHtmlEntities(jsonLd.creator.name)
      if (jsonLd.author?.name) return decodeHtmlEntities(jsonLd.author.name)
      if (jsonLd.publisher?.name) return decodeHtmlEntities(jsonLd.publisher.name)
    } catch {
      // Ignore JSON parse errors
    }
  }
  
  return null
}

/**
 * Extract curator from meta tags
 */
function extractCuratorFromMetaTags(html: string): string | null {
  const ownerMetaMatch = html.match(/<meta\s+property=["']music:creator["']\s+content=["']([^"']+)["']/i) ||
    html.match(/<meta\s+name=["']author["']\s+content=["']([^"']+)["']/i)
  
  if (ownerMetaMatch?.[1]) {
    return decodeHtmlEntities(ownerMetaMatch[1])
  }
  
  return null
}

