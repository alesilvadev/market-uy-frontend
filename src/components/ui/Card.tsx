'use client'

import { cn } from '@/lib/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-gray-300 rounded-xl p-5 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardContent({ className, children }: CardProps) {
  return <div className={cn('', className)}>{children}</div>
}

export function CardHeader({ className, children }: CardProps) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function CardTitle({ className, children }: CardProps) {
  return <h3 className={cn('text-lg font-bold text-gray-900', className)}>{children}</h3>
}
