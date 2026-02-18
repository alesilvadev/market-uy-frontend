'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiService, Order, CashierUser } from '@/services/api'
import { Button, Input, Card, Toast } from '@/components/ui'
import { CartItemCard } from '@/components/CartItemCard'

export default function CashierDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<CashierUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [orderCode, setOrderCode] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('cashier_token')
    const storedUser = localStorage.getItem('cashier_user')

    if (!storedToken || !storedUser) {
      router.push('/cashier/login')
      return
    }

    setToken(storedToken)
    setUser(JSON.parse(storedUser))
  }, [router])

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderCode.trim() || !token) return

    setIsLoading(true)
    setError(null)
    setOrder(null)

    try {
      const response = await apiService.getCashierOrder(orderCode, token)

      if (response.data.success && response.data.data) {
        setOrder(response.data.data)
      } else {
        setError('Pedido no encontrado')
      }
    } catch (err) {
      setError('Error buscando pedido')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOrder = async () => {
    if (!order || !token) return

    setIsProcessing(true)

    try {
      const response = await apiService.verifyOrder(order.id, token)

      if (response.data.success && response.data.data) {
        setOrder(response.data.data)
        setToast({
          message: 'Pedido verificado',
          type: 'success',
        })
      }
    } catch (err) {
      setToast({
        message: 'Error verificando pedido',
        type: 'error',
      })
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMarkPaid = async () => {
    if (!order || !token) return

    setIsProcessing(true)

    try {
      const response = await apiService.markOrderPaid(order.id, token)

      if (response.data.success && response.data.data) {
        setOrder(response.data.data)
        setToast({
          message: 'Pedido marcado como pagado',
          type: 'success',
        })
      }
    } catch (err) {
      setToast({
        message: 'Error marcando pago',
        type: 'error',
      })
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMarkReady = async () => {
    if (!order || !token) return

    setIsProcessing(true)

    try {
      const response = await apiService.markOrderReady(order.id, token)

      if (response.data.success && response.data.data) {
        setOrder(response.data.data)
        setToast({
          message: 'Pedido listo para retiro',
          type: 'success',
        })
      }
    } catch (err) {
      setToast({
        message: 'Error actualizando pedido',
        type: 'error',
      })
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('cashier_token')
    localStorage.removeItem('cashier_user')
    router.push('/cashier/login')
  }

  if (!user || !token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    )
  }

  const subtotal = order?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Caja</h1>
            <p className="text-gray-600 mt-1">Bienvenida, {user.name}</p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>

        <Card className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Buscar Pedido</h2>
          <form onSubmit={handleSearchOrder} className="flex gap-2">
            <Input
              id="order-code"
              type="text"
              placeholder="Ingresa código de pedido"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
              disabled={isLoading}
              error={error || undefined}
              className="flex-1"
            />
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || !orderCode.trim()}
              size="md"
            >
              Buscar
            </Button>
          </form>
        </Card>

        {order && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Pedido: {order.id}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Estado: <span className="font-semibold capitalize">{order.status}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Artículos ({order.items.length})
                  </p>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-900">
                          {item.name} <span className="text-gray-500">× {item.quantity}</span>
                        </span>
                        <span className="font-semibold">${item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {order.wishlistItems.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <h3 className="font-bold text-gray-900 mb-3">Artículos Deseados</h3>
                  <div className="space-y-2">
                    {order.wishlistItems.map((item) => (
                      <div key={item.id} className="text-sm">
                        <p className="text-gray-900">{item.name}</p>
                        <p className="text-gray-500 text-xs">
                          SKU: {item.code} • {item.quantity} unds
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <Card>
                <h3 className="font-bold text-gray-900 mb-4">Resumen de Totales</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${subtotal}</span>
                  </div>
                  {order.tax > 0 && (
                    <div className="flex justify-between text-sm">
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

              <Card>
                <h3 className="font-bold text-gray-900 mb-4">Acciones</h3>
                <div className="space-y-2">
                  {order.status === 'pending' && (
                    <Button
                      onClick={handleVerifyOrder}
                      isLoading={isProcessing}
                      disabled={isProcessing}
                      size="sm"
                      className="w-full"
                    >
                      Verificar Pedido
                    </Button>
                  )}

                  {(order.status === 'confirmed' || order.status === 'pending') && (
                    <Button
                      onClick={handleMarkPaid}
                      isLoading={isProcessing}
                      disabled={isProcessing}
                      size="sm"
                      className="w-full"
                    >
                      Marcar como Pagado
                    </Button>
                  )}

                  {order.status === 'paid' && (
                    <Button
                      onClick={handleMarkReady}
                      isLoading={isProcessing}
                      disabled={isProcessing}
                      size="sm"
                      className="w-full"
                      variant="success"
                    >
                      Marcar como Listo
                    </Button>
                  )}

                  {order.status === 'ready' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-green-700">
                        Listo para retiro
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  )
}
