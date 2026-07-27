"use client"

import { motion } from "framer-motion"
import { MapPin } from "lucide-react"
import type { PlaylistLocation } from "@/types/playlist"

interface MarkerPreviewProps {
  location: PlaylistLocation
  x: number
  y: number
}

/**
 * Radio.garden-style floating preview shown while hovering a globe marker.
 * Positioned near the cursor; follows the pointer via x/y props.
 */
export function MarkerPreview({ location, x, y }: MarkerPreviewProps) {
  const place = [location.city, location.country].filter(Boolean).join(", ")

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="pointer-events-none fixed z-50 w-64 -translate-x-1/2 -translate-y-[calc(100%+16px)]"
      style={{ left: x, top: y }}
    >
      <div className="overflow-hidden rounded-xl border border-border/60 bg-popover/90 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-3 p-3">
          <div
            className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted"
            style={!location.coverImage ? { backgroundImage: location.gradient } : undefined}
          >
            {location.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={location.coverImage || "/placeholder.svg"}
                alt=""
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-popover-foreground">{location.title}</p>
            <p className="truncate text-xs text-muted-foreground">{location.curator}</p>
          </div>
        </div>
        {place ? (
          <div className="flex items-center gap-1.5 border-t border-border/60 px-3 py-2">
            <MapPin className="h-3 w-3 text-globe-accent" strokeWidth={2.5} />
            <span className="truncate text-xs text-muted-foreground">{place}</span>
            <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground/70">
              Click to open
            </span>
          </div>
        ) : (
          <div className="border-t border-border/60 px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground/70">
            Click to open
          </div>
        )}
      </div>
    </motion.div>
  )
}
