import { decodeHtmlEntities, isValidCurator } from "./utils"

/**
 * Extract curator/owner information from Apple Music HTML
 */
export function extractAppleMusicCurator(html: string, url: string): string | null {
  // Method 1: Extract from title tag if it contains "by <curator> on Apple Music"
  const curatorFromTitle = extractCuratorFromTitle(html)
  if (curatorFromTitle) return curatorFromTitle

  // Method 2: Extract from URL path
  const curatorFromUrl = extractCuratorFromUrl(url)
  if (curatorFromUrl) return curatorFromUrl

  // Method 3: Check description for curator patterns
  const curatorFromDescription = extractCuratorFromDescription(html)
  if (curatorFromDescription) return curatorFromDescription

  // Method 4: Check for JSON-LD structured data
  const curatorFromJsonLd = extractCuratorFromJsonLd(html)
  if (curatorFromJsonLd) return curatorFromJsonLd

  return null
}

/**
 * Extract curator from title tag
 */
function extractCuratorFromTitle(html: string): string | null {
  const titlePattern1 = /<title[^>]*>([^<]+)<\/title>/i
  const titlePattern2 = /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i
  const titlePattern3 = /<meta\s+content=["']([^"']+)["']\s+property=["']og:title["']/i
  
  const titleTagMatch = titlePattern1.exec(html) || titlePattern2.exec(html) || titlePattern3.exec(html)
  
  if (!titleTagMatch?.[1]) return null

  const title = decodeHtmlEntities(titleTagMatch[1])
  // Pattern: "Title by Curator on Apple Music" or "Title by Curator"
  const byPattern = /by\s+(.+?)(?:\s+on\s+Apple\s+Music)?$/i
  const byMatch = byPattern.exec(title)
  
  if (byMatch?.[1]) {
    let curator = byMatch[1].trim()
    // Remove "- Apple Music" suffix if present
    curator = curator.replace(/\s*-\s*Apple\s+Music\s*$/i, '').trim()
    
    if (isValidCurator(curator)) {
      return curator
    }
  }
  
  return null
}

/**
 * Extract curator from URL path
 */
function extractCuratorFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathPattern = /\/playlist\/([^/]+)\//i
    const pathMatch = pathPattern.exec(urlObj.pathname)
    if (!pathMatch?.[1]) return null

    const pathParts = pathMatch[1].split('-')
    // If we have at least 2 parts, try the last 2 as curator name
    // e.g., "its-a-mad-world-joshua-yeadon" -> "joshua-yeadon"
    if (pathParts.length >= 2) {
      const lastTwo = pathParts.slice(-2)
      const curatorFromUrl = lastTwo
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
      
      // Only use if it looks like a name (2 words, both capitalized)
      if (curatorFromUrl.split(' ').length === 2 && 
          lastTwo.every(word => word.length > 1)) {
        return curatorFromUrl
      }
    }
  } catch {
    // Ignore URL parsing errors
  }
  
  return null
}

/**
 * Extract curator from description
 */
function extractCuratorFromDescription(html: string): string | null {
  const descriptionPattern1 = /<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i
  const descriptionPattern2 = /<meta\s+content=["']([^"']+)["']\s+property=["']og:description["']/i
  
  const descriptionMatch = descriptionPattern1.exec(html) || descriptionPattern2.exec(html)
  
  if (!descriptionMatch?.[1]) return null

  const description = decodeHtmlEntities(descriptionMatch[1])
  const patterns = [
    /(?:by|curated by|from|created by)\s+([^•\n·\r]+?)(?:\s*•|\s*\n|$)/i,
    /(?:by|curated by|from)\s+([^•\n]+)/i,
  ]
  
  for (const pattern of patterns) {
    const match = pattern.exec(description)
    if (match?.[1]) {
      const curator = match[1].trim()
      if (isValidCurator(curator)) {
        return curator
      }
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
 * Clean Apple Music title by removing "by <curator> on Apple Music" patterns
 */
export function cleanAppleMusicTitle(title: string, curator: string | null): string {
  let cleaned = title

  // First, remove "on Apple Music" suffix (with or without curator)
  cleaned = cleaned.replace(/\s+on\s+Apple\s+Music$/i, '').trim()
  
  if (!curator) {
    // Fallback: remove common patterns even without curator
    cleaned = cleaned
      .replace(/\s+by\s+[^-]+?\s*-\s*Apple\s+Music\s+on\s+Apple\s+Music$/i, '')
      .replace(/\s+by\s+[^-]+?\s+on\s+Apple\s+Music$/i, '')
      .replace(/\s+by\s+[^-]+?\s*-\s*Apple\s+Music$/i, '')
      .trim()
    return cleaned
  }

  // Escape special regex characters in curator name
  const escapedCurator = curator.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\\$&`)
  
  // Remove various patterns: "by curator on Apple Music", "by curator - Apple Music on Apple Music", "by curator"
  cleaned = cleaned
    .replace(new RegExp(String.raw`\s+by\s+${escapedCurator}\s*-\s*Apple\s+Music\s+on\s+Apple\s+Music$`, 'i'), '')
    .replace(new RegExp(String.raw`\s+by\s+${escapedCurator}\s+on\s+Apple\s+Music$`, 'i'), '')
    .replace(new RegExp(String.raw`\s+by\s+${escapedCurator}\s*-\s*Apple\s+Music$`, 'i'), '')
    .replace(new RegExp(String.raw`\s+by\s+${escapedCurator}$`, 'i'), '')
    .trim()
  
  return cleaned
}

