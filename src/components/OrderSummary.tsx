'use client'

import { Card } from '@/components/ui'

interface OrderSummaryProps {
  subtotal: number
  tax?: number
  total: number
  itemsCount: number
}

export function OrderSummary({ subtotal, tax = 0, total, itemsCount }: OrderSummaryProps) {
  return (
    <Card className="sticky bottom-0 mt-6">
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{itemsCount} artículos</span>
          <span className="text-gray-600">${subtotal}</span>
        </div>

        {tax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Impuesto</span>
            <span className="text-gray-600">${tax}</span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-3 flex justify-between">
          <span className="font-bold text-gray-900 text-lg">Total</span>
          <span className="font-bold text-blue-600 text-xl">${total}</span>
        </div>
      </div>
    </Card>
  )
}
