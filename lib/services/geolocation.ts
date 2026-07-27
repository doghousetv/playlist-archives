import type { NextRequest } from "next/server"

export interface GeoLocation {
  latitude: number | null
  longitude: number | null
  city: string | null
  country: string | null
}

const EMPTY_GEO: GeoLocation = {
  latitude: null,
  longitude: null,
  city: null,
  country: null,
}

function decodeHeader(value: string | null): string | null {
  if (!value) return null
  try {
    // Vercel URL-encodes non-ASCII values (e.g. "San%20Francisco")
    return decodeURIComponent(value) || null
  } catch {
    return value || null
  }
}

function parseCoord(value: string | null): number | null {
  if (!value) return null
  const num = Number.parseFloat(value)
  return Number.isFinite(num) ? num : null
}

/**
 * Extract the client IP from forwarding headers.
 */
function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim()
    if (first) return first
  }
  return request.headers.get("x-real-ip")
}

function isPrivateOrLocalIp(ip: string | null): boolean {
  if (!ip) return true
  return (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.2") ||
    ip.startsWith("172.30.") ||
    ip.startsWith("172.31.") ||
    ip.startsWith("fc") ||
    ip.startsWith("fd")
  )
}

/**
 * Look up geolocation for an IP address via a free geo API.
 * Passing an empty IP geolocates the caller (used as a dev fallback).
 */
async function lookupIp(ip: string | null): Promise<GeoLocation> {
  try {
    const endpoint = ip
      ? `https://ipapi.co/${encodeURIComponent(ip)}/json/`
      : `https://ipapi.co/json/`

    const res = await fetch(endpoint, {
      headers: { "User-Agent": "playlist-archives/1.0" },
      // Never let a slow geo lookup block the request for long.
      signal: AbortSignal.timeout(4000),
    })

    if (!res.ok) return EMPTY_GEO

    const data = (await res.json()) as {
      latitude?: number
      longitude?: number
      city?: string
      country_name?: string
      error?: boolean
    }

    if (data.error || typeof data.latitude !== "number" || typeof data.longitude !== "number") {
      return EMPTY_GEO
    }

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city ?? null,
      country: data.country_name ?? null,
    }
  } catch {
    return EMPTY_GEO
  }
}

/**
 * Resolve the approximate location of the person adding a playlist.
 *
 * 1. In production on Vercel we read the edge geo headers (no external call).
 * 2. Otherwise (e.g. local dev) we fall back to an IP geolocation lookup.
 *
 * This never throws — geolocation is best-effort and returns nulls on failure.
 */
export async function getGeoFromRequest(request: NextRequest): Promise<GeoLocation> {
  // 1. Vercel edge geolocation headers (available in production).
  const latitude = parseCoord(request.headers.get("x-vercel-ip-latitude"))
  const longitude = parseCoord(request.headers.get("x-vercel-ip-longitude"))

  if (latitude !== null && longitude !== null) {
    return {
      latitude,
      longitude,
      city: decodeHeader(request.headers.get("x-vercel-ip-city")),
      country: decodeHeader(request.headers.get("x-vercel-ip-country")),
    }
  }

  // 2. Fallback: IP-based lookup (dev / non-Vercel hosting).
  const ip = getClientIp(request)
  return lookupIp(isPrivateOrLocalIp(ip) ? null : ip)
}
