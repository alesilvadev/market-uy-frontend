'use client'

import { useOrderStore, CartItem } from '@/store/orderStore'

/**
 * Custom hook for managing order operations
 * Provides convenient methods for cart management
 */
export const useOrder = () => {
  const order = useOrderStore((state) => state.order)
  const addToCart = useOrderStore((state) => state.addToCart)
  const removeFromCart = useOrderStore((state) => state.removeFromCart)
  const updateQuantity = useOrderStore((state) => state.updateQuantity)
  const moveToWishlist = useOrderStore((state) => state.moveToWishlist)
  const moveToCart = useOrderStore((state) => state.moveToCart)
  const clearCart = useOrderStore((state) => state.clearCart)
  const createOrder = useOrderStore((state) => state.createOrder)
  const resetOrder = useOrderStore((state) => state.resetOrder)

  return {
    order,
    addToCart,
    removeFromCart,
    updateQuantity,
    moveToWishlist,
    moveToCart,
    clearCart,
    createOrder,
    resetOrder,
    cartItemsCount: order?.items.length ?? 0,
    cartTotal: order?.total ?? 0,
    wishlistCount: order?.wishlistItems.length ?? 0,
  }
}
