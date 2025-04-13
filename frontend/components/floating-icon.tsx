"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface FloatingIconProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function FloatingIcon({ children, delay = 0, duration = 6, className = "" }: FloatingIconProps) {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: duration,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        ease: "easeInOut",
        delay: delay,
      }}
    >
      {children}
    </motion.div>
  )
}
