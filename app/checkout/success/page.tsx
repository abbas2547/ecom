'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const [redirectCountdown, setRedirectCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setRedirectCountdown(prev => {
        if (prev <= 1) {
          router.push('/admin/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center text-4xl"
        >
          ✓
        </motion.div>

        <h1 className="text-4xl font-light mb-3 text-gray-900">
          Order Placed!
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        {orderId && (
          <div className="bg-white rounded-lg p-6 mb-8 border-2 border-green-200">
            <p className="text-sm text-gray-600 mb-2">Order ID</p>
            <p className="text-xl font-semibold text-gray-900 break-all">{orderId}</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-900">
            📧 A confirmation email has been sent to your inbox
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-lg font-semibold transition"
          >
            Continue Shopping
          </button>
        </motion.div>

        <p className="text-sm text-gray-500 mt-6">
          Redirecting to dashboard in {redirectCountdown} seconds...
        </p>
      </motion.div>
    </div>
  )
}
