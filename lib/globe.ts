import * as THREE from "three"

/** Radius of the globe in world units. */
export const GLOBE_RADIUS = 1.6

/** Path to the equirectangular land mask used to place land dots. */
export const LAND_MASK_SRC = "/assets/earth-landmask.png"

/**
 * Convert latitude/longitude (in degrees) to a point on a sphere.
 * The same mapping is used for both the land dots and the playlist markers,
 * so markers always land on the correct part of the rendered continents.
 */
export function latLngToVector3(
  lat: number,
  lng: number,
  radius: number = GLOBE_RADIUS
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  const x = -radius * Math.sin(phi) * Math.cos(theta)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return new THREE.Vector3(x, y, z)
}

/**
 * Map latitude/longitude to normalized texture coordinates (0..1) that match
 * `latLngToVector3`, so sampling the land mask lines up with marker positions.
 */
export function latLngToUV(lat: number, lng: number): { u: number; v: number } {
  return {
    u: (lng + 180) / 360,
    v: (90 - lat) / 180,
  }
}
