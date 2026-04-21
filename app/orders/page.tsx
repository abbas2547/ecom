'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface OrderProduct {
  productId: string
  quantity: number
  price: number
  name?: string // Assuming product name can be added for display
  image?: string // Assuming product image can be added for display
}

interface Order {
  _id: string
  userId: string
  products: OrderProduct[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    zip: string
    paymentMethod: string
  }
  cancellationReason?: string // Added for cancellation reason
}

export default function UserOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null)
  const [cancellationReason, setCancellationReason] = useState('')

  useEffect(() => {
    // In a real application, you would fetch user-specific orders from an API
    // For this demo, we're loading from localStorage
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[]
    setOrders(storedOrders)
    setLoading(false)
  }, [])

  const handleCancelOrder = () => {
    if (!orderToCancel || !cancellationReason.trim()) return

    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === orderToCancel
          ? { ...order, status: 'cancelled', cancellationReason: cancellationReason.trim() }
          : order
      )
    )

    // Update localStorage
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[]
    const updatedStoredOrders = storedOrders.map(order =>
      order._id === orderToCancel
        ? { ...order, status: 'cancelled', cancellationReason: cancellationReason.trim() }
        : order
    )
    localStorage.setItem('orders', JSON.stringify(updatedStoredOrders))

    setShowCancelModal(false)
    setOrderToCancel(null)
    setCancellationReason('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600 text-lg mb-4">You haven't placed any orders yet.</p>
            <Link href="/" className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition transform hover:scale-105">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Order #{order._id.slice(-6)}</h2>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                    {order.status !== 'cancelled' && (
                      <button
                        onClick={() => {
                          setOrderToCancel(order._id)
                          setShowCancelModal(true)
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
                
                {order.cancellationReason && (
                  <p className="text-sm text-red-500 mb-2">Reason: {order.cancellationReason}</p>
                )}
                
                <p className="text-sm text-gray-500 mb-4">Placed on: {new Date(order.createdAt).toLocaleString()}</p>

                <div className="space-y-3 mb-4 border-t border-b border-gray-200 py-4">
                  {order.products.map((product, index) => (
                    <div key={index} className="flex items-center gap-4">
                      {/* You might want to fetch product details (name, image) based on productId */}
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">Product ID: {product.productId}</p>
                        <p className="text-sm text-gray-500">Qty: {product.quantity} x ₹{product.price}</p>
                      </div>
                      <p className="font-semibold text-gray-800">₹{product.price * product.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-gray-800">Total:</p>
                  <p className="text-lg font-bold text-gray-800">₹{order.total}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full">
              <h3 className="text-lg font-bold mb-4">Cancel Order</h3>
              <p className="mb-4">Please provide a short reason for cancelling your order:</p>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                rows={3}
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="e.g., Changed my mind, ordered wrong item"
              ></textarea>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false)
                    setOrderToCancel(null)
                    setCancellationReason('')
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={!cancellationReason.trim()}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition disabled:opacity-50"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
