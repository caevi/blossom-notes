import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const messages = [
  "You are doing better than you think 💕",
  "I’m proud of you, always 🌸",
  "Take it one step at a time, love 💌",
  "You deserve softness today 🧸",
  "Even on hard days, you are still loved 💖",
  "I hope you smile a little today 🌷"
]

export default function LovePopup() {
  // 🌟 FIX: Safely calculate whether it should be visible right on initial render
  const [visible, setVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem("lovePopupShown")
    }
    return false
  })

  const [message] = useState(() => {
    return messages[Math.floor(Math.random() * messages.length)]
  })

  useEffect(() => {
    if (visible) {
      sessionStorage.setItem("lovePopupShown", "true")

      const timer = setTimeout(() => {
        setVisible(false)
      }, 4000)

      return () => clearTimeout(timer) // Clean up timer on unmount
    }
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="love-popup"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.4 }}
        >
          💕 {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}