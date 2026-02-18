import { create } from 'zustand'

export interface CartItem {
  id: string
  code: string
  name: string
  price: number
  quantity: number
  color?: string
  image?: string
}

export interface Order {
  id: string
  items: CartItem[]
  wishlistItems: CartItem[]
  total: number
  subtotal: number
  tax: number
  status: 'draft' | 'pending' | 'confirmed' | 'paid' | 'ready' | 'delivered'
  createdAt: Date
  clientId?: string
}

interface OrderStore {
  order: Order | null
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  moveToWishlist: (itemId: string) => void
  moveToCart: (itemId: string) => void
  clearCart: () => void
  createOrder: () => void
  resetOrder: () => void
}

const initialOrder: Order = {
  id: '',
  items: [],
  wishlistItems: [],
  total: 0,
  subtotal: 0,
  tax: 0,
  status: 'draft',
  createdAt: new Date(),
}

export const useOrderStore = create<OrderStore>((set) => ({
  order: { ...initialOrder },

  addToCart: (item: CartItem) =>
    set((state) => {
      if (!state.order) return state
      const existingItem = state.order.items.find((i) => i.id === item.id)
      const updatedItems = existingItem
        ? state.order.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          )
        : [...state.order.items, item]
      return {
        order: {
          ...state.order,
          items: updatedItems,
          subtotal: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        },
      }
    }),

  removeFromCart: (itemId: string) =>
    set((state) => {
      if (!state.order) return state
      const updatedItems = state.order.items.filter((i) => i.id !== itemId)
      return {
        order: {
          ...state.order,
          items: updatedItems,
          subtotal: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        },
      }
    }),

  updateQuantity: (itemId: string, quantity: number) =>
    set((state) => {
      if (!state.order) return state
      const updatedItems = state.order.items.map((i) =>
        i.id === itemId ? { ...i, quantity: Math.max(0, quantity) } : i
      )
      return {
        order: {
          ...state.order,
          items: updatedItems,
          subtotal: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        },
      }
    }),

  moveToWishlist: (itemId: string) =>
    set((state) => {
      if (!state.order) return state
      const item = state.order.items.find((i) => i.id === itemId)
      if (!item) return state
      return {
        order: {
          ...state.order,
          items: state.order.items.filter((i) => i.id !== itemId),
          wishlistItems: [...state.order.wishlistItems, item],
        },
      }
    }),

  moveToCart: (itemId: string) =>
    set((state) => {
      if (!state.order) return state
      const item = state.order.wishlistItems.find((i) => i.id === itemId)
      if (!item) return state
      return {
        order: {
          ...state.order,
          wishlistItems: state.order.wishlistItems.filter((i) => i.id !== itemId),
          items: [...state.order.items, item],
        },
      }
    }),

  clearCart: () =>
    set(() => ({
      order: { ...initialOrder },
    })),

  createOrder: () =>
    set((state) => {
      if (!state.order) return state
      return {
        order: {
          ...state.order,
          id: `ORD-${Date.now()}`,
          status: 'pending',
        },
      }
    }),

  resetOrder: () =>
    set(() => ({
      order: { ...initialOrder },
    })),
}))
