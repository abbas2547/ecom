'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  isNew?: boolean
  isBestSeller?: boolean
  quantity: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'cod'
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const savedCart = localStorage.getItem('checkoutCart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    } else {
      router.push('/')
    }

    const savedAddress = localStorage.getItem('savedAddress')
    if (savedAddress) {
      setFormData(prev => ({ ...prev, ...JSON.parse(savedAddress) }))
    }
  }, [router])

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handlePlaceOrder = async () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.name) newErrors.name = 'Full Name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.phone) newErrors.phone = 'Phone Number is required'
    if (!formData.address) newErrors.address = 'Address is required'
    if (!formData.city) newErrors.city = 'City is required'
    if (!formData.zip) newErrors.zip = 'ZIP Code is required'
    if (formData.paymentMethod !== 'cod') newErrors.paymentMethod = 'Only Cash on Delivery is available at the moment.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setLoading(true)
    
    // Simulate order placement
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Save order to localStorage for demo (in real app, this would go to backend)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const newOrder = {
      _id: Date.now().toString(),
      userId: 'guest',
      products: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      total: total + 40, // Add shipping fee to total
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customer: formData
    }
    orders.unshift(newOrder)
    localStorage.setItem('orders', JSON.stringify(orders))

    // Save address details to localStorage
    localStorage.setItem('savedAddress', JSON.stringify({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      zip: formData.zip
    }))
    
    // Clear cart
    localStorage.removeItem('checkoutCart')
    
    setOrderPlaced(true)
    setLoading(false)
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Placed!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase! Your order has been placed successfully.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-black mb-8 transition-all duration-200 ease-in-out transform hover:-translate-x-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Checkout</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="order-2 md:order-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-800">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>₹40</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{total + 40}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Shipping & Payment */}
          <div className="order-1 md:order-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Shipping Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                    {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Method</h2>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-black transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-black"
                  />
                  <span className="ml-3 font-medium text-gray-800">Cash on Delivery</span>
                </label>
                
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-not-allowed bg-gray-100">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-gray-400"
                    disabled
                  />
                  <span className="ml-3 font-medium text-gray-500">Credit/Debit Card <span className="text-xs text-gray-400">(Coming Soon)</span></span>
                </label>
                
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-not-allowed bg-gray-100">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-gray-400"
                    disabled
                  />
                  <span className="ml-3 font-medium text-gray-500">UPI <span className="text-xs text-gray-400">(Coming Soon)</span></span>
                </label>
              </div>
            </div>
            {errors.paymentMethod && <p className="text-red-500 text-xs mt-1 text-center">{errors.paymentMethod}</p>}
            
            <button
              onClick={handlePlaceOrder}
              disabled={loading || cartItems.length === 0 || formData.paymentMethod !== 'cod'}
              className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Placing Order...' : `Place Order - ₹${total}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
