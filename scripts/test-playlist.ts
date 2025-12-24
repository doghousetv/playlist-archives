import "dotenv/config"
import { prisma } from "../lib/prisma"
import { 
  createPlaylistEntry, 
  scrapeAndUpdatePlaylist 
} from "../lib/services/playlist-service"

async function main() {
  const playlistUrl = process.argv[2] || "https://open.spotify.com/playlist/71uAiEwZdZSTFoqnfTFEqA?si=83cb5dfd7a1d40c0"

  console.log("Creating playlist entry...")
  const createResult = await createPlaylistEntry({ url: playlistUrl })

  if (!createResult.success) {
    console.error("Failed to create playlist:", createResult.error)
    return
  }

  if (!createResult.playlist) {
    console.error("No playlist returned from create")
    return
  }

  console.log("Created playlist:", createResult.playlist)

  console.log("Scraping and updating playlist metadata...")
  try {
    await scrapeAndUpdatePlaylist(createResult.playlist.id)
    console.log("Successfully scraped and updated playlist metadata")
  } catch (error) {
    console.error("Error scraping metadata:", error)
  }

  // Fetch the final playlist
  const finalPlaylist = await prisma.playlist.findUnique({
    where: { id: createResult.playlist.id }
  })

  console.log("\nFinal playlist data:")
  console.log(JSON.stringify(finalPlaylist, null, 2))

  // Fetch all playlists
  const allPlaylists = await prisma.playlist.findMany()
  console.log(`\nTotal playlists in database: ${allPlaylists.length}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

