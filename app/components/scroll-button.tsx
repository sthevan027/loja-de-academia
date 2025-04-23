"use client"

import type React from "react"

interface ScrollButtonProps {
  targetId: string
  className?: string
  children: React.ReactNode
}

export default function ScrollButton({ targetId, className, children }: ScrollButtonProps) {
  const handleClick = () => {
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
