'use client'

import { Button, Card } from '@/components/ui'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-md mx-auto pt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Market Uy</h1>
          <p className="text-lg text-gray-600">Sistema de Autogestión de Pedidos</p>
        </div>

        <div className="space-y-4">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Cliente</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Escanea el código QR o accede aquí para armar tu pedido mientras recorres el local.
            </p>
            <Link href="/order" className="block">
              <Button className="w-full" size="lg">
                Comenzar Compra
              </Button>
            </Link>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Caja</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Panel para verificar y procesar pedidos del cliente.
            </p>
            <Link href="/cashier/login" className="block">
              <Button variant="secondary" className="w-full" size="lg">
                Acceso Panel de Caja
              </Button>
            </Link>
          </Card>
        </div>

        <p className="text-center text-xs text-gray-500 mt-12">
          © 2026 Market Uy - Propuesta de Valor<br />
          Sistema optimizado para comercio minorista
        </p>
      </div>
    </main>
  )
}
