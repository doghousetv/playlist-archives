"use client"

import LandingSection from "@/components/landing-section"
import ArchiveSection from "@/components/archive-section"
import GrainTexture from "@/components/grain-texture"

export default function PlaylistArchive() {
  return (
    <>
      <GrainTexture />
      <div className="snap-y snap-mandatory h-screen w-screen overflow-scroll scrollbar-hide overflow-x-hidden bg-neutral-50 dark:bg-neutral-950">
        <LandingSection />
        <ArchiveSection />
      </div>
    </>
  )
}
