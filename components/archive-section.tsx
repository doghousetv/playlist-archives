"use client"

import { useState, useRef } from "react"
import { Plus } from "lucide-react"
import { useSWRConfig } from "swr"
import PlaylistGrid from "@/components/playlist-grid"
import PlaylistDialog from "@/components/playlist-dialog"
import { Section, SectionHeader, SectionTitle, Container, AnimatedTextInView, Button } from "@/components/ui"
import { ANIMATION } from "@/lib/constants"

export default function ArchiveSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const refreshKeyRef = useRef(0)
  const { mutate } = useSWRConfig()

  return (
    <Section 
      id="archive-section" 
      snap 
      className="bg-white dark:bg-neutral-900 pt-12 pb-20"
    >
      {/* Subtle top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-neutral-50 dark:from-neutral-950 to-transparent pointer-events-none" />

      <div className="relative z-10">
        {/* Section Header */}
        <Container className="mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <SectionHeader overline="Collection">
              <AnimatedTextInView delay={ANIMATION.DELAY.SHORT}>
                <SectionTitle>Browse Playlists</SectionTitle>
              </AnimatedTextInView>
            </SectionHeader>

            <AnimatedTextInView delay={ANIMATION.DELAY.MEDIUM}>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="group hover:gap-3"
              >
                <Plus className="w-4 h-4" />
                Add Playlist
              </Button>
            </AnimatedTextInView>
          </div>
        </Container>

        {/* Playlist Grid */}
        <PlaylistGrid 
          key={refreshKeyRef.current} 
          onAddPlaylistClick={() => setIsDialogOpen(true)}
        />

        {/* Add Playlist Dialog */}
        <PlaylistDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
          onPlaylistAdded={() => {
            refreshKeyRef.current += 1
            mutate("/api/playlists/count")
          }}
        />
      </div>
    </Section>
  )
}

