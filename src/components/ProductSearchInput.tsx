'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui'
import { cn } from '@/lib/cn'

interface ProductSearchInputProps {
  onSearchChange: (code: string) => void
  error?: string
  disabled?: boolean
  placeholder?: string
}

export function ProductSearchInput({
  onSearchChange,
  error,
  disabled,
  placeholder = 'Ingresa código SKU',
}: ProductSearchInputProps) {
  const [code, setCode] = useState('')
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer)

    const timer = setTimeout(() => {
      if (code.trim()) {
        onSearchChange(code.trim())
      }
    }, 300)

    setDebounceTimer(timer)

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [code, onSearchChange])

  return (
    <Input
      id="sku-input"
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      value={code}
      onChange={(e) => setCode(e.currentTarget.value.toUpperCase())}
      error={error}
      disabled={disabled}
      autoFocus
    />
  )
}
