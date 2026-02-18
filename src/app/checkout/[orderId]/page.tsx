'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { apiService, Order } from '@/services/api'
import { Button, Card } from '@/components/ui'
import { CartItemCard } from '@/components/CartItemCard'

export default function CheckoutPage() {
  const params = useParams()
  const orderId = params.orderId as string

  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await apiService.getOrder(orderId)
        if (response.data.success && response.data.data) {
          setOrder(response.data.data)
        } else {
          setError('Pedido no encontrado')
        }
      } catch (err) {
        setError('Error cargando pedido')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto pt-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto pt-8">
          <Card>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => (window.location.href = '/')}>
              Volver al inicio
            </Button>
          </Card>
        </div>
      </main>
    )
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      <div className="max-w-md mx-auto p-4">
        <div className="pt-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pedido Confirmado</h1>
          <p className="text-lg text-green-600 font-bold mb-2">{order.id}</p>
          <p className="text-sm text-gray-600">Presenta este código en caja</p>
        </div>

        <Card className="mb-6 bg-green-50 border-green-200">
          <div className="text-center">
            <p className="text-4xl font-mono font-bold text-green-600 mb-2">
              {order.id}
            </p>
            <p className="text-sm text-gray-600">
              Copia y muestra este código en caja
            </p>
          </div>
        </Card>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Resumen del Pedido ({order.items.length} artículos)
          </h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                isMutable={false}
                onQuantityChange={() => {}}
                onRemove={() => {}}
              />
            ))}
          </div>
        </div>

        <Card>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${subtotal}</span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Impuesto</span>
                <span className="font-semibold">${order.tax}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-blue-600 text-lg">
                ${order.total}
              </span>
            </div>
          </div>
        </Card>

        <div className="mt-6 space-y-2">
          <Button
            onClick={() => (window.location.href = '/order')}
            variant="secondary"
            className="w-full"
          >
            Seguir comprando
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            className="w-full"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    </main>
  )
}
