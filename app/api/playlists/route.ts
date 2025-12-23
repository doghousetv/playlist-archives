import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateRandomGradient } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "24", 10)
    const skip = (page - 1) * limit

    // Fetch playlists from database
    const [playlists, totalCount] = await Promise.all([
      prisma.playlist.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.playlist.count(),
    ])

    // Transform database playlists to match frontend Playlist type
    const transformedPlaylists = playlists.map((playlist) => ({
      id: playlist.id,
      title: playlist.title || "Untitled Playlist",
      // Gradients are now persisted, but fallback for legacy data
      gradient: playlist.gradient || generateRandomGradient(),
      curator: playlist.curator || "Unknown",
      url: playlist.url,
      coverImage: playlist.coverImage || undefined,
      platform: playlist.platform as "spotify" | "apple-music",
    }))

    const totalPages = Math.ceil(totalCount / limit)
    const hasMore = page < totalPages

    return NextResponse.json(
      {
        playlists: transformedPlaylists,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasMore,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching playlists:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch playlists",
      },
      { status: 500 }
    )
  }
}

