'use client'

import { useState } from 'react'
import { Button, Modal } from '@/components/ui'

interface NumericPadProps {
  isOpen: boolean
  onConfirm: (code: string) => void
  onCancel: () => void
}

export function NumericPad({ isOpen, onConfirm, onCancel }: NumericPadProps) {
  const [code, setCode] = useState('')

  const handleNumberClick = (num: string) => {
    if (code.length < 20) {
      setCode(code + num)
    }
  }

  const handleDelete = () => {
    setCode(code.slice(0, -1))
  }

  const handleConfirm = () => {
    if (code.trim()) {
      onConfirm(code.trim())
      setCode('')
    }
  }

  const handleCancel = () => {
    setCode('')
    onCancel()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Ingresa Código de Producto"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={handleCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!code.trim()}
            className="flex-1"
          >
            Buscar
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 text-center min-h-16 flex items-center justify-center">
          <p className="text-3xl font-bold text-gray-900 tracking-widest font-mono">
            {code || ''}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(String(num))}
              className="aspect-square bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl rounded-lg transition-colors"
            >
              {num}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleNumberClick('0')}
            className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl rounded-lg transition-colors aspect-square flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg rounded-lg transition-colors aspect-square flex items-center justify-center"
          >
            ← Atrás
          </button>
        </div>
      </div>
    </Modal>
  )
}
