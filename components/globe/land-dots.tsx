"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { GLOBE_RADIUS, LAND_MASK_SRC, latLngToUV, latLngToVector3 } from "@/lib/globe"

interface LandDotsProps {
  color: string
  /** Angular spacing between dots, in degrees. Smaller = denser. */
  step?: number
  size?: number
  opacity?: number
}

/**
 * Renders the continents as a field of small dots by sampling an
 * equirectangular land mask. Dots are only placed over land pixels.
 */
export default function LandDots({ color, step = 1.7, size = 0.02, opacity = 0.55 }: LandDotsProps) {
  const [positions, setPositions] = useState<Float32Array | null>(null)
  const pointsRef = useRef<THREE.Points>(null)

  // Circular sprite so each point renders as a soft round dot, not a square.
  const dotTexture = useMemo(() => {
    const size = 64
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")!
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, "rgba(255,255,255,1)")
    gradient.addColorStop(0.6, "rgba(255,255,255,1)")
    gradient.addColorStop(1, "rgba(255,255,255,0)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = LAND_MASK_SRC

    img.onload = () => {
      if (cancelled) return
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d", { willReadFrequently: true })
      if (!ctx) return
      ctx.drawImage(img, 0, 0)
      const { data, width, height } = ctx.getImageData(0, 0, img.width, img.height)

      const coords: number[] = []
      for (let lat = -85; lat <= 85; lat += step) {
        const latRad = (lat * Math.PI) / 180
        // Keep roughly even spacing by scaling longitude density with latitude.
        const lngCount = Math.max(1, Math.round((360 / step) * Math.cos(latRad)))
        for (let i = 0; i < lngCount; i++) {
          const lng = -180 + (360 / lngCount) * i
          const { u, v } = latLngToUV(lat, lng)
          const px = Math.min(width - 1, Math.max(0, Math.floor(u * width)))
          const py = Math.min(height - 1, Math.max(0, Math.floor(v * height)))
          const idx = (py * width + px) * 4
          // White pixels = land.
          if (data[idx] > 120) {
            const pos = latLngToVector3(lat, lng, GLOBE_RADIUS * 1.002)
            coords.push(pos.x, pos.y, pos.z)
          }
        }
      }
      if (!cancelled) setPositions(new Float32Array(coords))
    }

    return () => {
      cancelled = true
    }
  }, [step])

  const geometry = useMemo(() => {
    if (!positions) return null
    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  if (!geometry) return null

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color={color}
        size={size}
        map={dotTexture}
        alphaMap={dotTexture}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
