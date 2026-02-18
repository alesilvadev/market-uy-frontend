'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/cn'

interface ToastProps {
  message: string
  type?: 'success' | 'error'
  onClose: () => void
  duration?: number
}

export function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500'
  const icon = type === 'success' ? '✓' : '✕'

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50',
        'text-white px-4 py-3 rounded-lg flex items-center gap-2',
        'animate-in slide-in-from-bottom-4 duration-300',
        bgColor
      )}
    >
      <span className="text-lg font-bold">{icon}</span>
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}
