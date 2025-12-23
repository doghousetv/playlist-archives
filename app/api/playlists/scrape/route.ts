import { NextRequest, NextResponse } from "next/server"
import { 
  createPlaylistEntry, 
  scrapeAndUpdatePlaylist 
} from "@/lib/services/playlist-service"
import { validatePlaylistUrl } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      )
    }

    // Validate the URL
    const validation = validatePlaylistUrl(url)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error || "Invalid playlist URL" },
        { status: 400 }
      )
    }

    // Create playlist entry in database
    const createResult = await createPlaylistEntry({ url })
    
    if (!createResult.success) {
      return NextResponse.json(
        { error: createResult.error },
        { status: createResult.error === "Playlist already exists" ? 409 : 400 }
      )
    }

    if (!createResult.playlist) {
      return NextResponse.json(
        { error: "Failed to create playlist" },
        { status: 500 }
      )
    }

    // Scrape and update playlist metadata
    try {
      await scrapeAndUpdatePlaylist(createResult.playlist.id)
    } catch (scrapeError) {
      console.error("Error scraping playlist metadata:", scrapeError)
      // Return the playlist even if scraping failed
      return NextResponse.json(
        { 
          playlist: createResult.playlist,
          warning: "Playlist created but metadata scraping failed"
        },
        { status: 201 }
      )
    }

    // Fetch the updated playlist
    const { prisma } = await import("@/lib/prisma")
    const updatedPlaylist = await prisma.playlist.findUnique({
      where: { id: createResult.playlist.id }
    })

    return NextResponse.json(
      { 
        success: true,
        playlist: updatedPlaylist 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in scrape endpoint:", error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to scrape playlist" 
      },
      { status: 500 }
    )
  }
}

