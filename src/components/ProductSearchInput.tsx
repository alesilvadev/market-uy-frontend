'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { NumericPad } from './NumericPad'

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
  const [isNumericPadOpen, setIsNumericPadOpen] = useState(false)

  const handleNumericPadConfirm = (code: string) => {
    onSearchChange(code)
    setIsNumericPadOpen(false)
  }

  return (
    <>
      <div className="space-y-2">
        <Button
          onClick={() => setIsNumericPadOpen(true)}
          disabled={disabled}
          className="w-full"
          size="lg"
        >
          Ingresa Código de Producto
        </Button>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>

      <NumericPad
        isOpen={isNumericPadOpen}
        onConfirm={handleNumericPadConfirm}
        onCancel={() => setIsNumericPadOpen(false)}
      />
    </>
  )
}
