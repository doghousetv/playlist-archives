"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import useSWR from "swr"
import ThemeToggle from "@/components/theme-toggle"
import { Globe } from "@/components/globe/globe"
import { scrollToElement } from "@/lib/utils"
import type { PlaylistLocationsResponse } from "@/types/playlist"

export default function GlobeSection() {
  const { data: countData } = useSWR<{ count: number }>("/api/playlists/count")
  const { data: locationData } = useSWR<PlaylistLocationsResponse>("/api/playlists/locations")

  const totalPlaylists = countData?.count ?? 0
  const totalLocations = locationData?.count ?? 0

  const handleViewAll = () => scrollToElement("archive-section")

  return (
    <section className="relative h-screen w-screen snap-start snap-always overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      {/* The globe fills the whole hero */}
      <div className="absolute inset-0">
        <Globe />
      </div>

      {/* Header: brand + actions */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-start justify-between p-6">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="pointer-events-auto"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
            Global Collection
          </p>
          <h1 className="mt-1 text-lg font-normal tracking-tight text-black dark:text-white">
            The Playlist Archive
          </h1>
        </motion.div>

        <div className="pointer-events-auto flex items-center gap-3">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            onClick={handleViewAll}
            className="group flex h-10 items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 text-xs font-medium text-black backdrop-blur-sm transition-all duration-300 hover:gap-3 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform" />
          </motion.button>

          {/* ThemeToggle positions itself absolutely (top-6 right-6) */}
          <ThemeToggle />
        </div>
      </header>

      {/* Footer: stats + hint */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex flex-col items-center gap-2 p-6 text-center"
      >
        <p className="font-mono text-xs tracking-wide text-black/40 dark:text-white/40">
          <span className="tabular-nums text-black dark:text-white">{totalPlaylists}</span> playlists
          <span className="mx-2 text-black/20 dark:text-white/20">/</span>
          <span className="tabular-nums text-black dark:text-white">{totalLocations}</span> located worldwide
        </p>
        <p className="text-[11px] uppercase tracking-[0.18em] text-black/30 dark:text-white/30">
          Drag to rotate · Hover a dot · Scroll to zoom
        </p>
      </motion.div>
    </section>
  )
}
