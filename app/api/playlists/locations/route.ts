import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateRandomGradient } from "@/lib/utils"

/**
 * Returns every playlist that has resolved coordinates, for plotting on the globe.
 */
export async function GET() {
  try {
    const playlists = await prisma.playlist.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      orderBy: { createdAt: "desc" },
    })

    const locations = playlists.map((playlist) => ({
      id: playlist.id,
      title: playlist.title || "Untitled Playlist",
      curator: playlist.curator || "Unknown",
      url: playlist.url,
      coverImage: playlist.coverImage || undefined,
      gradient: playlist.gradient || generateRandomGradient(),
      platform: playlist.platform as "spotify" | "apple-music",
      latitude: playlist.latitude as number,
      longitude: playlist.longitude as number,
      city: playlist.city || undefined,
      country: playlist.country || undefined,
    }))

    return NextResponse.json({ locations, count: locations.length }, { status: 200 })
  } catch (error) {
    console.error("Error fetching playlist locations:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch locations" },
      { status: 500 }
    )
  }
}
