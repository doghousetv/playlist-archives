import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Smooth scroll to element by ID
 */
export function scrollToElement(elementId: string) {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}

/**
 * Generate mock playlists for testing
 */
export function generateMockPlaylists(count: number, gradients: readonly string[]) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    title: `Playlist ${i + 1}`,
    gradient: gradients[i % gradients.length],
    curator: `User ${Math.floor(i / 4) + 1}`,
  }))
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Validate playlist URL for Spotify or Apple Music
 * @param url - The URL to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validatePlaylistUrl(url: string): { isValid: boolean; error?: string } {
  if (!url || url.trim() === "") {
    return { isValid: false, error: "Please enter a playlist URL" }
  }

  try {
    const urlObj = new URL(url.trim())
    const hostname = urlObj.hostname.toLowerCase()
    const pathname = urlObj.pathname.toLowerCase()

    // Check if URL contains "playlist" in the path
    if (!pathname.includes("playlist")) {
      return {
        isValid: false,
        error: "This doesn't look like a playlist",
      }
    }

    // Validate Spotify playlist URL
    // Format: https://open.spotify.com/playlist/...
    if (hostname === "open.spotify.com") {
      const spotifyPlaylistPattern = /^\/playlist\/[^/]+/
      if (spotifyPlaylistPattern.test(pathname)) {
        return { isValid: true }
      }
      return {
        isValid: false,
        error: "This doesn't look like a Spotify playlist",
      }
    }

    // Validate Apple Music playlist URL
    // Format: https://music.apple.com/.../playlist/...
    if (hostname === "music.apple.com") {
      const applePlaylistPattern = /\/playlist\/[^/]+/
      if (applePlaylistPattern.test(pathname)) {
        return { isValid: true }
      }
      return {
        isValid: false,
        error: "This doesn't look like an Apple Music playlist",
      }
    }

    // If domain doesn't match Spotify or Apple Music
    return {
      isValid: false,
      error: "We currently don't support playlists from this platform",
    }
  } catch {
    return {
      isValid: false,
      error: "This doesn't look like a playlist",
    }
  }
}

