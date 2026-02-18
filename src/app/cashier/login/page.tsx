'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiService } from '@/services/api'
import { Button, Input, Card, Toast } from '@/components/ui'

export default function CashierLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    setIsLoading(true)

    try {
      const response = await apiService.cashierLogin(email, password)

      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data

        localStorage.setItem('cashier_token', token)
        localStorage.setItem('cashier_user', JSON.stringify(user))

        setToast({
          message: `Bienvenida, ${user.name}!`,
          type: 'success',
        })

        setTimeout(() => {
          router.push('/cashier/dashboard')
        }, 1000)
      } else {
        setError('Credenciales inválidas')
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta nuevamente.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Uy</h1>
            <p className="text-gray-600">Panel de Caja</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              error={error ? undefined : undefined}
            />

            <Input
              id="password"
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              error={error || undefined}
            />

            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              Iniciar Sesión
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-6">
          © 2026 Market Uy - Sistema de Autogestión de Pedidos
        </p>
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
