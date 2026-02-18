'use client'

import { useState } from 'react'
import { Modal, Button } from '@/components/ui'

export interface Product {
  id: string
  code: string
  name: string
  price: number
  description?: string
  image?: string
  colors?: string[]
  inStock: boolean
  quantity: number
}

interface ProductConfirmModalProps {
  isOpen: boolean
  product: Product | null
  onConfirm: (quantity: number, color?: string) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ProductConfirmModal({
  isOpen,
  product,
  onConfirm,
  onCancel,
  isLoading = false,
}: ProductConfirmModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string | undefined>()

  if (!product) return null

  const handleConfirm = () => {
    onConfirm(quantity, selectedColor)
    setQuantity(1)
    setSelectedColor(undefined)
  }

  const handleClose = () => {
    setQuantity(1)
    setSelectedColor(undefined)
    onCancel()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={product.name}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={!product.inStock}
            className="flex-1"
          >
            Agregar
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg bg-gray-100"
          />
        )}

        <div>
          <p className="text-sm text-gray-500 font-mono mb-1">SKU: {product.code}</p>
          <p className="text-2xl font-bold text-blue-600">${product.price}</p>
        </div>

        {product.description && (
          <p className="text-sm text-gray-600">{product.description}</p>
        )}

        {!product.inStock && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700 font-medium">Producto sin stock</p>
          </div>
        )}

        {product.colors && product.colors.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    selectedColor === color
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'border border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="quantity" className="text-sm font-medium text-gray-700 mb-2 block">
            Cantidad
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold"
              disabled={quantity === 1 || isLoading}
            >
              −
            </button>
            <input
              id="quantity"
              type="number"
              min="1"
              max="9999"
              value={quantity}
              onChange={(e) => {
                const val = Math.max(1, Math.min(9999, Number(e.target.value)))
                setQuantity(val)
              }}
              className="flex-1 text-center border-2 border-gray-300 rounded-lg py-2 font-semibold focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={() => setQuantity(Math.min(9999, quantity + 1))}
              className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold"
              disabled={quantity === 9999 || isLoading}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
