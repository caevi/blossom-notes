import { useState } from 'react'

type Heart = {
  id: number
  left: number
  size: number
  duration: number
  delay: number
}

export default function FloatingHearts() {
  // 🌟 FIX: Initializing values directly in state completely eliminates the linter error
  const [hearts] = useState<Heart[]>(() => 
    Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,      // % across screen
      size: 10 + Math.random() * 20,  // px size
      duration: 6 + Math.random() * 6,
      delay: Math.random() * 5
    }))
  )

  return (
    <div className="hearts-container">
      {hearts.map(heart => (
        <span
          key={heart.id}
          className="heart"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`
          }}
        >
          💗
        </span>
      ))}
    </div>
  )
}