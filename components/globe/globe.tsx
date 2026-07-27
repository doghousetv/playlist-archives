"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import useSWR from "swr"
import { useTheme } from "next-themes"
import type { PlaylistLocation, PlaylistLocationsResponse } from "@/types/playlist"
import { GlobeScene, type GlobeColors } from "./globe-scene"
import { MarkerPreview } from "./marker-preview"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const LIGHT_COLORS: GlobeColors = {
  sphere: "#ededee",
  land: "#131313",
  accent: "#c98a1e",
  atmosphere: "#000000",
}

const DARK_COLORS: GlobeColors = {
  sphere: "#141414",
  land: "#ededed",
  accent: "#f0b429",
  atmosphere: "#ffffff",
}

export function Globe() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState<PlaylistLocation | null>(null)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [autoRotate, setAutoRotate] = useState(true)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { data } = useSWR<PlaylistLocationsResponse>("/api/playlists/locations", fetcher, {
    revalidateOnFocus: false,
  })

  const locations = data?.locations ?? []

  const colors = useMemo(
    () => (resolvedTheme === "dark" ? DARK_COLORS : LIGHT_COLORS),
    [resolvedTheme]
  )

  const handleHover = useCallback((location: PlaylistLocation | null) => {
    setHovered(location)
  }, [])

  const handleSelect = useCallback((location: PlaylistLocation) => {
    if (location.url) {
      window.open(location.url, "_blank", "noopener,noreferrer")
    }
  }, [])

  // Pause auto-rotation while the user is interacting, then gently resume.
  const pauseRotation = useCallback(() => {
    setAutoRotate(false)
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
  }, [])

  const scheduleResume = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => setAutoRotate(true), 2500)
  }, [])

  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current)
    }
  }, [])

  return (
    <div
      className="relative h-full w-full"
      onPointerMove={(e) => setPointer({ x: e.clientX, y: e.clientY })}
    >
      {mounted && (
        <Canvas
          camera={{ position: [0, 0.4, 4.4], fov: 42 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          onPointerDown={pauseRotation}
          onPointerUp={scheduleResume}
        >
          <ambientLight intensity={1} />
          <GlobeScene
            locations={locations}
            colors={colors}
            autoRotate={autoRotate}
            activeId={hovered?.id ?? null}
            onHover={handleHover}
            onSelect={handleSelect}
          />
          <OrbitControls
            enablePan={false}
            enableZoom
            minDistance={3.2}
            maxDistance={7}
            rotateSpeed={0.4}
            zoomSpeed={0.6}
            enableDamping
            dampingFactor={0.08}
          />
        </Canvas>
      )}

      {hovered && <MarkerPreview location={hovered} x={pointer.x} y={pointer.y} />}
    </div>
  )
}
