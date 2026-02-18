'use client'

import { useEffect, useState } from 'react'
import { useOrder } from '@/hooks/useOrder'
import { apiService, Product, Order } from '@/services/api'
import { Button, Toast } from '@/components/ui'
import { ProductSearchInput } from '@/components/ProductSearchInput'
import { ProductConfirmModal } from '@/components/ProductConfirmModal'
import { CartItemCard } from '@/components/CartItemCard'
import { OrderSummary } from '@/components/OrderSummary'

export default function OrderPage() {
  const { order, addToCart, removeFromCart, updateQuantity, moveToWishlist, clearCart, createOrder: storeCreateOrder, moveToCart } = useOrder()

  const [isInitializing, setIsInitializing] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showWishlist, setShowWishlist] = useState(false)

  useEffect(() => {
    const initializeOrder = async () => {
      try {
        if (!order || order.id === '') {
          const response = await apiService.createOrder()
          if (response.data.success && response.data.data) {
            // Store ID in state to track
            const newOrder: Order = {
              ...response.data.data,
              items: [],
              wishlistItems: [],
              total: 0,
              subtotal: 0,
              tax: 0,
            }
          }
        }
      } catch (error) {
        console.error('Failed to initialize order:', error)
      } finally {
        setIsInitializing(false)
      }
    }

    initializeOrder()
  }, [])

  const handleSearchProduct = async (code: string) => {
    if (!code) return

    setIsSearching(true)
    setSearchError(null)

    try {
      const response = await apiService.searchProduct(code)
      if (response.data.success && response.data.data) {
        setSelectedProduct(response.data.data)
      } else {
        setSearchError(`No encontramos el código ${code}`)
      }
    } catch (error) {
      setSearchError('Error buscando producto. Intenta nuevamente.')
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleConfirmProduct = async (quantity: number, color?: string) => {
    if (!selectedProduct || !order || order.id === '') return

    setIsConfirming(true)

    try {
      const response = await apiService.addToOrder(
        order.id,
        selectedProduct.code,
        quantity,
        color
      )

      if (response.data.success && response.data.data) {
        // Update local state with items from response
        const newOrder = response.data.data
        clearCart()

        newOrder.items.forEach((item) => {
          addToCart({
            id: item.id,
            code: item.code,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            color: item.color,
          })
        })

        setToast({
          message: `${selectedProduct.name} agregado al carrito`,
          type: 'success',
        })
        setSelectedProduct(null)
      }
    } catch (error) {
      setToast({
        message: 'Error al agregar producto',
        type: 'error',
      })
      console.error('Add to order error:', error)
    } finally {
      setIsConfirming(false)
    }
  }

  const handleCloseOrder = async () => {
    if (!order || order.id === '' || order.items.length === 0) return

    setIsClosing(true)

    try {
      const response = await apiService.closeOrder(order.id)

      if (response.data.success && response.data.data) {
        setToast({
          message: `Pedido confirmado: ${response.data.data.id}`,
          type: 'success',
        })

        // Show order code and reset
        setTimeout(() => {
          clearCart()
          window.location.href = `/checkout/${response.data.data?.id}`
        }, 1500)
      }
    } catch (error) {
      setToast({
        message: 'Error al cerrar pedido',
        type: 'error',
      })
      console.error('Close order error:', error)
    } finally {
      setIsClosing(false)
    }
  }

  if (isInitializing) {
    return (
      <main className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto pt-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    )
  }

  const cartItems = order?.items || []
  const wishlistItems = order?.wishlistItems || []
  const itemsCount = cartItems.length
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal

  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      <div className="max-w-md mx-auto p-4">
        <div className="pt-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Uy</h1>
          <p className="text-sm text-gray-600">Código de pedido: {order?.id || 'nuevo'}</p>
        </div>

        <div className="space-y-6">
          <ProductSearchInput
            onSearchChange={handleSearchProduct}
            error={searchError || undefined}
            disabled={isSearching}
          />

          {itemsCount > 0 && (
            <>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-gray-900">Carrito ({itemsCount})</h2>
                  {wishlistItems.length > 0 && (
                    <button
                      onClick={() => setShowWishlist(!showWishlist)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Deseados ({wishlistItems.length})
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onQuantityChange={(qty) => updateQuantity(item.id, qty)}
                      onRemove={() => removeFromCart(item.id)}
                      onMoveToWishlist={() => moveToWishlist(item.id)}
                    />
                  ))}
                </div>
              </div>

              {showWishlist && wishlistItems.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Deseados</h3>
                  <div className="space-y-3">
                    {wishlistItems.map((item) => (
                      <CartItemCard
                        key={item.id}
                        item={item}
                        isMutable={false}
                        onQuantityChange={() => {}}
                        onRemove={() => {}}
                        onMoveToWishlist={() => moveToCart(item.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <OrderSummary
                subtotal={subtotal}
                total={total}
                itemsCount={itemsCount}
              />

              <Button
                onClick={handleCloseOrder}
                isLoading={isClosing}
                disabled={itemsCount === 0}
                className="w-full"
                size="lg"
              >
                Cerrar Pedido
              </Button>
            </>
          )}

          {itemsCount === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Ingresa un código SKU para comenzar
              </p>
            </div>
          )}
        </div>
      </div>

      <ProductConfirmModal
        isOpen={selectedProduct !== null}
        product={selectedProduct}
        onConfirm={handleConfirmProduct}
        onCancel={() => setSelectedProduct(null)}
        isLoading={isConfirming}
      />

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
