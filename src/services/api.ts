import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response wrapper types
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
  }
}

export interface Product {
  id: string
  code: string
  name: string
  price: number
  quantity: number
  inStock: boolean
  description?: string
  image?: string
  colors?: string[]
}

export interface CartItem {
  id: string
  code: string
  name: string
  price: number
  quantity: number
  color?: string
}

export interface Order {
  id: string
  items: CartItem[]
  wishlistItems: CartItem[]
  total: number
  subtotal: number
  tax: number
  status: 'draft' | 'pending' | 'confirmed' | 'paid' | 'ready' | 'delivered'
  createdAt: string
  clientId?: string
}

export interface CashierUser {
  id: string
  email: string
  name: string
  role: 'cashier' | 'admin'
}

export interface CashierSession {
  token: string
  user: CashierUser
}

// API Endpoints
export const apiService = {
  searchProduct: (code: string) =>
    api.get<ApiResponse<Product>>(`/api/products/search?code=${code}`),

  getProduct: (id: string) =>
    api.get<ApiResponse<Product>>(`/api/products/${id}`),

  createOrder: (clientId?: string) =>
    api.post<ApiResponse<Order>>('/api/orders', { clientId }),

  getOrder: (orderId: string) =>
    api.get<ApiResponse<Order>>(`/api/orders/${orderId}`),

  addToOrder: (orderId: string, code: string, quantity: number, color?: string) =>
    api.post<ApiResponse<Order>>(`/api/orders/${orderId}/items`, {
      code,
      quantity,
      color,
    }),

  updateOrderItem: (orderId: string, itemId: string, quantity?: number, color?: string) =>
    api.put<ApiResponse<Order>>(`/api/orders/${orderId}/items/${itemId}`, {
      quantity,
      color,
    }),

  removeFromOrder: (orderId: string, itemId: string) =>
    api.delete<ApiResponse<Order>>(`/api/orders/${orderId}/items/${itemId}`),

  addToWishlist: (orderId: string, code: string, quantity: number, color?: string) =>
    api.post<ApiResponse<Order>>(`/api/orders/${orderId}/wishlist`, {
      code,
      quantity,
      color,
    }),

  moveItem: (
    orderId: string,
    itemId: string,
    from: 'items' | 'wishlistItems',
    to: 'items' | 'wishlistItems'
  ) =>
    api.post<ApiResponse<Order>>(`/api/orders/${orderId}/move-item`, {
      itemId,
      from,
      to,
    }),

  closeOrder: (orderId: string, paymentMethod?: string, notes?: string) =>
    api.post<ApiResponse<Order>>(`/api/orders/${orderId}/close`, {
      paymentMethod,
      notes,
    }),

  cashierLogin: (email: string, password: string) =>
    api.post<ApiResponse<CashierSession>>('/api/cashier/login', {
      email,
      password,
    }),

  getCashierOrder: (orderId: string, token: string) =>
    api.get<ApiResponse<Order>>(`/api/cashier/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  verifyOrder: (orderId: string, token: string) =>
    api.post<ApiResponse<Order>>(
      `/api/cashier/orders/${orderId}/verify`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ),

  markOrderPaid: (orderId: string, token: string) =>
    api.post<ApiResponse<Order>>(
      `/api/cashier/orders/${orderId}/mark-paid`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ),

  markOrderReady: (orderId: string, token: string) =>
    api.post<ApiResponse<Order>>(
      `/api/cashier/orders/${orderId}/ready`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ),

  markOrderDelivered: (orderId: string, token: string) =>
    api.post<ApiResponse<Order>>(
      `/api/cashier/orders/${orderId}/deliver`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ),
}

export default api
