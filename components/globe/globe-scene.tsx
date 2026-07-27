"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Group } from "three"
import { GLOBE_RADIUS } from "@/lib/globe"
import type { PlaylistLocation } from "@/types/playlist"
import LandDots from "./land-dots"
import Markers from "./markers"

export interface GlobeColors {
  sphere: string
  land: string
  accent: string
  atmosphere: string
}

interface GlobeSceneProps {
  locations: PlaylistLocation[]
  colors: GlobeColors
  autoRotate: boolean
  activeId: number | null
  onHover: (location: PlaylistLocation | null) => void
  onSelect: (location: PlaylistLocation) => void
}

export function GlobeScene({ locations, colors, autoRotate, activeId, onHover, onSelect }: GlobeSceneProps) {
  const groupRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06
    }
  })

  return (
    <group ref={groupRef}>
      {/* Base sphere — solid body slightly smaller than the dot shell */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 0.99, 64, 64]} />
        <meshBasicMaterial color={colors.sphere} />
      </mesh>

      {/* Thin atmospheric rim, rendered on the backside for a soft halo */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 1.12, 64, 64]} />
        <meshBasicMaterial color={colors.atmosphere} transparent opacity={0.06} side={2} depthWrite={false} />
      </mesh>

      <LandDots color={colors.land} />
      <Markers
        locations={locations}
        accent={colors.accent}
        activeId={activeId}
        onHover={onHover}
        onSelect={onSelect}
      />
    </group>
  )
}
