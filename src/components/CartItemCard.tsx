'use client'

import { Button } from '@/components/ui'

export interface CartItem {
  id: string
  code: string
  name: string
  price: number
  quantity: number
  color?: string
}

interface CartItemCardProps {
  item: CartItem
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
  onMoveToWishlist?: () => void
  isMutable?: boolean
}

export function CartItemCard({
  item,
  onQuantityChange,
  onRemove,
  onMoveToWishlist,
  isMutable = true,
}: CartItemCardProps) {
  const totalPrice = item.price * item.quantity

  return (
    <div className="flex items-center gap-4 border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-mono mb-1">{item.code}</p>
        <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
        {item.color && <p className="text-xs text-gray-500 mt-1">Color: {item.color}</p>}
      </div>

      {isMutable ? (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onQuantityChange(Math.max(1, item.quantity - 1))}
            className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 text-sm font-bold"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => {
              const val = Math.max(1, Math.min(9999, Number(e.target.value)))
              onQuantityChange(val)
            }}
            className="w-12 text-center text-sm font-semibold border border-gray-300 rounded"
            aria-label="Quantity"
          />
          <button
            onClick={() => onQuantityChange(Math.min(9999, item.quantity + 1))}
            className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 text-sm font-bold"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      ) : (
        <p className="text-sm font-semibold text-gray-700 w-12 text-right">{item.quantity}x</p>
      )}

      <div className="text-right">
        <p className="text-lg font-bold text-blue-600">${totalPrice}</p>
        <p className="text-xs text-gray-500 mt-1">${item.price} c/u</p>
      </div>

      {isMutable && (
        <div className="flex flex-col gap-2">
          {onMoveToWishlist && (
            <button
              onClick={onMoveToWishlist}
              className="p-2 text-gray-500 hover:text-gray-700"
              aria-label="Move to wishlist"
              title="Move to wishlist"
            >
              ♡
            </button>
          )}
          <button
            onClick={onRemove}
            className="p-2 text-red-500 hover:text-red-700"
            aria-label="Remove item"
            title="Remove item"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
