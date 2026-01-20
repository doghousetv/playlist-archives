"use client"

import { SWRConfig } from "swr"
import LandingSection from "@/components/landing-section"
import ArchiveSection from "@/components/archive-section"
import GrainTexture from "@/components/grain-texture"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function PlaylistArchive() {
  return (
    <SWRConfig value={{ fetcher }}>
      <GrainTexture />
      <div className="snap-y snap-mandatory h-screen w-screen overflow-scroll scrollbar-hide overflow-x-hidden bg-neutral-50 dark:bg-neutral-950">
        <LandingSection />
        <ArchiveSection />
      </div>
    </SWRConfig>
  )
}
