/**
 * Animation constants for consistent motion design
 */
export const ANIMATION = {
  // Easing curves
  EASING: {
    SMOOTH: [0.22, 1, 0.36, 1] as const,
    EASE_OUT: "easeOut" as const,
    EASE_IN_OUT: "easeInOut" as const,
  },
  
  // Durations (in seconds)
  DURATION: {
    FAST: 0.1,
    NORMAL: 0.3,
    SLOW: 0.5,
    VERY_SLOW: 0.8,
    EXTRA_SLOW: 1,
    SUPER_SLOW: 2,
  },
  
  // Delays (in seconds)
  DELAY: {
    NONE: 0,
    SHORT: 0.1,
    MEDIUM: 0.2,
    LONG: 0.3,
    EXTRA_LONG: 0.5,
    STAGGER_SHORT: 0.02,
    STAGGER_MEDIUM: 0.05,
  },
} as const

/**
 * Mock playlist gradient colors
 */
export const PLAYLIST_GRADIENTS = [
  "from-blue-400 to-blue-500",
  "from-purple-400 to-purple-500",
  "from-pink-400 to-pink-500",
  "from-orange-400 to-orange-500",
  "from-green-400 to-green-500",
  "from-indigo-400 to-indigo-500",
  "from-rose-400 to-rose-500",
  "from-teal-400 to-teal-500",
  "from-cyan-400 to-cyan-500",
  "from-amber-400 to-amber-500",
] as const

/**
 * Layout constants
 */
export const LAYOUT = {
  MAX_WIDTH: "max-w-7xl",
  PADDING: {
    X: "px-6",
    Y: "py-20",
  },
  SECTION_GAP: "mb-12",
} as const

