"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { PlaylistLocation } from "@/types/playlist"
import { GLOBE_RADIUS, latLngToVector3 } from "@/lib/globe"

/** Soft radial sprite used for the marker glow / pulse. */
function useHaloTexture() {
  return useMemo(() => {
    const s = 128
    const canvas = document.createElement("canvas")
    canvas.width = s
    canvas.height = s
    const ctx = canvas.getContext("2d")!
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
    g.addColorStop(0, "rgba(255,255,255,0.9)")
    g.addColorStop(0.3, "rgba(255,255,255,0.35)")
    g.addColorStop(1, "rgba(255,255,255,0)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, s, s)
    return new THREE.CanvasTexture(canvas)
  }, [])
}

interface MarkerProps {
  location: PlaylistLocation
  accent: string
  active: boolean
  index: number
  halo: THREE.Texture
  onHover: (location: PlaylistLocation | null) => void
  onSelect: (location: PlaylistLocation) => void
}

function Marker({ location, accent, active, index, halo, onHover, onSelect }: MarkerProps) {
  const haloRef = useRef<THREE.Sprite>(null)
  const dotRef = useRef<THREE.Mesh>(null)

  const position = useMemo(
    () => latLngToVector3(location.latitude, location.longitude, GLOBE_RADIUS * 1.01),
    [location.latitude, location.longitude]
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.6 + index * 0.9)
    if (haloRef.current) {
      const base = active ? 0.34 : 0.2
      const scale = base + pulse * (active ? 0.22 : 0.12)
      haloRef.current.scale.setScalar(scale)
      const mat = haloRef.current.material as THREE.SpriteMaterial
      mat.opacity = active ? 0.9 : 0.35 + pulse * 0.25
    }
    if (dotRef.current) {
      const target = active ? 0.03 : 0.016
      const s = dotRef.current.scale.x
      dotRef.current.scale.setScalar(s + (target - s) * 0.2)
    }
  })

  return (
    <group
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(location)
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        onHover(null)
        document.body.style.cursor = "default"
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(location)
      }}
    >
      {/* Soft glow */}
      <sprite ref={haloRef} scale={0.2}>
        <spriteMaterial
          map={halo}
          color={accent}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      {/* Core dot */}
      <mesh ref={dotRef} scale={0.016}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
    </group>
  )
}

interface MarkersProps {
  locations: PlaylistLocation[]
  accent: string
  activeId: number | null
  onHover: (location: PlaylistLocation | null) => void
  onSelect: (location: PlaylistLocation) => void
}

export default function Markers({ locations, accent, activeId, onHover, onSelect }: MarkersProps) {
  const halo = useHaloTexture()
  return (
    <group>
      {locations.map((location, i) => (
        <Marker
          key={location.id}
          location={location}
          accent={accent}
          index={i}
          active={activeId === location.id}
          halo={halo}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </group>
  )
}
