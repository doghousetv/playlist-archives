"use client"

import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import useSWR from "swr"
import ThemeToggle from "@/components/theme-toggle"
import { Section, AnimatedText } from "@/components/ui"
import { ANIMATION } from "@/lib/constants"
import { scrollToElement } from "@/lib/utils"
import AnimatedCounter from "@/components/animated-counter"

export default function LandingSection() {
  const { data } = useSWR<{ count: number }>("/api/playlists/count")
  const totalPlaylists = data?.count || 0
  const handleScrollToArchive = () => scrollToElement("archive-section")

  return (
    <Section snap fullHeight className="flex items-center justify-center">
      <ThemeToggle />
      {/* Subtle halftone background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Large decorative gradient orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: ANIMATION.DURATION.SUPER_SLOW, 
          delay: ANIMATION.DELAY.EXTRA_LONG, 
          ease: ANIMATION.EASING.SMOOTH 
        }}
        className="absolute top-[15%] left-[5%] w-[500px] h-[500px] bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: ANIMATION.DURATION.SUPER_SLOW, 
          delay: 0.7, 
          ease: ANIMATION.EASING.SMOOTH 
        }}
        className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: ANIMATION.DURATION.SUPER_SLOW, 
          delay: 0.9, 
          ease: ANIMATION.EASING.SMOOTH 
        }}
        className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-gradient-to-br from-cyan-200/20 to-teal-200/20 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Overline */}
        <AnimatedText delay={ANIMATION.DELAY.MEDIUM} className="mb-8">
          <span className="inline-block px-5 py-2 text-xs font-medium tracking-[0.2em] uppercase bg-black/4 dark:bg-white/4 rounded-full border border-black/8 dark:border-white/8 text-black dark:text-white">
            Public Collection
          </span>
        </AnimatedText>

        {/* Main heading with enhanced styling */}
        <AnimatedText 
          delay={ANIMATION.DELAY.LONG} 
          as="h1"
          className="text-6xl md:text-8xl lg:text-[10rem] font-light tracking-tight mb-6 leading-[0.9] text-black dark:text-white"
        >
          <span className="block">The Playlist</span>
          <span className="block font-normal relative">
            Archive
            {/* Underline decoration */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ 
                duration: ANIMATION.DURATION.EXTRA_SLOW, 
                delay: 1.3, 
                ease: ANIMATION.EASING.SMOOTH 
              }}
              className="absolute -bottom-3 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent origin-center"
            />
          </span>
        </AnimatedText>

        {/* Description */}
        <AnimatedText 
          delay={ANIMATION.DELAY.EXTRA_LONG}
          as="p"
          className="text-base md:text-lg text-black/50 dark:text-white/50 max-w-xl mx-auto mb-12 leading-relaxed"
        >
          A curated collection of music playlists from listeners worldwide. 
          <br />
          Discover, share, and explore new sounds.
        </AnimatedText>

        {/* CTA Button - enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: ANIMATION.DURATION.VERY_SLOW, 
            delay: ANIMATION.DELAY.LONG, 
            ease: ANIMATION.EASING.SMOOTH 
          }}
        >
          <button
            onClick={handleScrollToArchive}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-full hover:bg-black/90 dark:hover:bg-white/90 transition-all duration-500 hover:gap-4 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-white/10 cursor-pointer"
          >
            <span>Explore</span>
            <ArrowDown className="w-4 h-4" />
            
            {/* Button glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 blur-xl" />
          </button>
        </motion.div>

        {/* Playlist Counter */}
        <AnimatedText 
          delay={ANIMATION.DELAY.EXTRA_LONG}
          as="div"
          className="mt-16 text-sm md:text-base font-mono tracking-wide"
        >
          <span className="text-black/40 dark:text-white/40 tabular-nums">
            <AnimatedCounter 
              from={0} 
              to={totalPlaylists}
              animationOptions={{
                duration: ANIMATION.DURATION.NORMAL,
                ease: "easeOut",
              }}
            />
          </span>
          <span className="text-black dark:text-white ml-2">
            playlists shared
          </span>
        </AnimatedText>
      </div>
    </Section>
  )
}

