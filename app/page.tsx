// ZYROX - Premium Fashion E-commerce (Next.js + Tailwind)

'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

// ---------------- TYPES ----------------

interface Product {
  name: string
  price: number
  originalPrice?: number
  image: string
  isNew?: boolean
  isBestSeller?: boolean
}

interface Collection {
  title: string
  description: string
  priceRange: string
  images: string[]
}

const newArrivals = [
  { name: 'Textured Knitted Shirt', price: 59, originalPrice: 79, image: 'https://framerusercontent.com/images/VW4VJmmdCt9WP6FoBGWnqDq6VS8.png?width=950&height=1024', isNew: true },
  { name: 'Structured Trench Coat', price: 210, originalPrice: 280, image: 'https://framerusercontent.com/images/liIxg0opfCsW1pRixs56aS3Aj4.jpeg?scale-down-to=1024&width=1248&height=816', isNew: true },
  { name: 'Mini Denim Overalls', price: 45, originalPrice: 60, image: 'https://framerusercontent.com/images/imHLb05OBp3rVa7DL12JicfwlE.png?width=956&height=1024', isNew: true },
  { name: 'Riviera Collar Shirt', price: 45, originalPrice: 60, image: 'https://framerusercontent.com/images/4zsYQkMwe0g61iw8T3MZGzvhak.png?width=961&height=1024', isNew: true },
  { name: 'Stretch Jersey Tee', price: 65, originalPrice: 95, image: 'https://framerusercontent.com/images/0g1kqNpbGUbeCR7eDqHjDWiv4s.png?width=937&height=1024', isNew: true },
  { name: 'Urban Utility Cargo', price: 90, originalPrice: 120, image: 'https://framerusercontent.com/images/cWQhDyWBhK2dbOvMbEutN5jO0s.png?width=891&height=1024', isNew: true },
  { name: 'Minimalist Linen Blazer', price: 120, originalPrice: 160, image: 'https://framerusercontent.com/images/FFAlreqmltBbtn7iNy9lIQTMI.png?width=968&height=1024', isNew: true },
  { name: 'Classic Denim Jacket', price: 95, originalPrice: 130, image: 'https://framerusercontent.com/images/6nknFZTNUtU9BA1FnqLy7dPrtmE.png?width=1024&height=1024', isNew: true },
  { name: 'Soft Wool Cardigan', price: 110, originalPrice: 150, image: 'https://framerusercontent.com/images/XY7DXjHvJ7qxI2SulzDqvBiRbvw.png?width=944&height=1024', isNew: true },
]

const bestSellers = [
  { name: 'Heavyweight Oversized Hoodie', price: 85, originalPrice: 110, image: 'https://framerusercontent.com/images/Mpbd0iQ2COOMJArbHqRZMQoFRA.png?width=838&height=1024', isBestSeller: true },
  { name: 'Patterned Knit Sweater', price: 45, originalPrice: 90, image: 'https://framerusercontent.com/images/FNS875X1XnR0GJd4UpTh1Zms.png?width=817&height=987', isBestSeller: true },
  { name: 'Quilted Bomber Jacket', price: 145, originalPrice: 180, image: 'https://framerusercontent.com/images/E6tqcNcNIbkMCzBYvnABQBtwcM.jpeg?scale-down-to=1024&width=1280&height=1280', isBestSeller: true },
  { name: 'Hooded Puffer Vest', price: 45, originalPrice: 75, image: 'https://framerusercontent.com/images/MLJe7H4csZkBunu5nEk84enCjM.png?width=965&height=1024', isBestSeller: true },
  { name: 'Premium Cotton T-Shirt', price: 35, originalPrice: 55, image: 'https://framerusercontent.com/images/VW4VJmmdCt9WP6FoBGWnqDq6VS8.png?width=950&height=1024', isBestSeller: true },
  { name: 'Flex Jogger Pants', price: 75, originalPrice: 100, image: 'https://framerusercontent.com/images/liIxg0opfCsW1pRixs56aS3Aj4.jpeg?scale-down-to=1024&width=1248&height=816', isBestSeller: true },
  { name: 'Sleek Chino Shorts', price: 55, originalPrice: 80, image: 'https://framerusercontent.com/images/imHLb05OBp3rVa7DL12JicfwlE.png?width=956&height=1024', isBestSeller: true },
  { name: 'Essential V-Neck Tee', price: 39, originalPrice: 60, image: 'https://framerusercontent.com/images/4zsYQkMwe0g61iw8T3MZGzvhak.png?width=961&height=1024', isBestSeller: true },
]

const collections = [
  {
    title: 'Premium modern collection for men',
    description: 'Upgrade your daily look with our crafted pieces made from the finest fabrics for lasting comfort and timeless style.',
    priceRange: '₹3,599 - ₹14,399',
    images: [
      'https://framerusercontent.com/images/FFAlreqmltBbtn7iNy9lIQTMI.png?width=968&height=1024',
      'https://framerusercontent.com/images/6nknFZTNUtU9BA1FnqLy7dPrtmE.png?width=1024&height=1024',
      'https://framerusercontent.com/images/XY7DXjHvJ7qxI2SulzDqvBiRbvw.png?width=944&height=1024'
    ]
  },
  {
    title: 'Modern daily wear for women',
    description: 'Elevate your style with our signature soft pieces designed to make every single day feel truly fresh and special.',
    priceRange: '₹2,799 - ₹11,999',
    images: [
      'https://framerusercontent.com/images/VW4VJmmdCt9WP6FoBGWnqDq6VS8.png?width=950&height=1024',
      'https://framerusercontent.com/images/liIxg0opfCsW1pRixs56aS3Aj4.jpeg?scale-down-to=1024&width=1248&height=816',
      'https://framerusercontent.com/images/imHLb05OBp3rVa7DL12JicfwlE.png?width=956&height=1024'
    ]
  },
  {
    title: 'Modern easy styles for children',
    description: 'Provide your children with the best soft touch gear made for play & long lasting wear throughout every single busy day.',
    priceRange: '₹1,999 - ₹7,199',
    images: [
      'https://framerusercontent.com/images/cWQhDyWBhK2dbOvMbEutN5jO0s.png?width=891&height=1024',
      'https://framerusercontent.com/images/Mpbd0iQ2COOMJArbHqRZMQoFRA.png?width=838&height=1024',
      'https://framerusercontent.com/images/FNS875X1XnR0GJd4UpTh1Zms.png?width=817&height=987'
    ]
  }
]

// Navbar now accepts cart props
function Navbar({ cartCount, onToggleCart, showCart }: { cartCount: number, onToggleCart: () => void, showCart: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent backdrop-blur-md border-b border-white/20 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center bg-black/10">
        <div className="flex items-center space-x-3">
         
          <div className="text-2xl font-light tracking-wider text-white">ELUEE</div>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-sm text-white">
          <a href="#home" className="hover:text-gray-200 transition">Home</a>
          <a href="#about" className="hover:text-gray-200 transition">About</a>
          <a href="#collections" className="hover:text-gray-200 transition">Shop</a>
          <a href="#blog" className="hover:text-gray-200 transition">Blog</a>
          <a href="https://instagram.com/eluue2547" target="_blank" className="hover:text-gray-200 transition">Contact</a>
          <a href="/login" className="hover:text-gray-200 transition">Login</a>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4 text-white">
          {/* Cart Button */}
          <button 
            onClick={onToggleCart}
            className="text-xl relative hover:scale-110 transition cursor-pointer"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-xl hover:scale-110 transition cursor-pointer"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-black/95 border-b border-white/20"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col space-y-3 text-sm text-white">
            <a href="#home" className="hover:text-gray-200 transition py-2" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#about" className="hover:text-gray-200 transition py-2" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#collections" className="hover:text-gray-200 transition py-2" onClick={() => setMobileMenuOpen(false)}>Shop</a>
            <a href="#blog" className="hover:text-gray-200 transition py-2" onClick={() => setMobileMenuOpen(false)}>Blog</a>
            <a href="#contact" className="hover:text-gray-200 transition py-2" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            <a href="/login" className="hover:text-gray-200 transition py-2" onClick={() => setMobileMenuOpen(false)}>Login</a>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

// Cart Sidebar Component - Enhanced Design
function CartSidebar({ isOpen, onClose, cartCount, onRemoveItem }: { isOpen: boolean, onClose: () => void, cartCount: number, onRemoveItem: () => void }) {
  if (!isOpen) return null

  const cartItems = Array.from({ length: cartCount }).map((_, i) => {
    const itemNames = [
      'Textured Knitted Shirt',
      'Structured Trench Coat',
      'Mini Denim Overalls',
      'Riviera Collar Shirt',
      'Stretch Jersey Tee',
      'Urban Utility Cargo',
      'Minimalist Linen Blazer',
      'Classic Denim Jacket',
      'Heavyweight Oversized Hoodie',
      'Patterned Knit Sweater',
      'Quilted Bomber Jacket',
      'Hooded Puffer Vest',
    ]
    return itemNames[i % itemNames.length]
  })

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          exit={{ x: 400 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-screen w-full max-w-sm bg-gradient-to-br from-white to-gray-50 z-50 flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-black to-gray-800 text-white p-6 flex justify-between items-center rounded-b-2xl">
            <div>
              <h2 className="text-3xl font-light">Shopping Bag</h2>
              <p className="text-sm text-gray-300 mt-1">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={onClose}
              className="text-2xl hover:scale-110 transition bg-white/20 w-10 h-10 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
          </div>
          
          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartCount === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🛍️</div>
                <p className="text-gray-500 text-lg">Your bag is empty</p>
                <p className="text-gray-400 text-sm mt-2">Add items to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group flex justify-between items-start p-4 bg-white rounded-xl border border-gray-200 hover:border-black hover:shadow-md transition"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item}</p>
                      <p className="text-xs text-gray-500 mt-1">Item #{i + 1}</p>
                    </div>
                    <button
                      onClick={onRemoveItem}
                      className="ml-2 text-gray-400 hover:text-red-500 hover:scale-110 transition text-lg"
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartCount > 0 && (
            <div className="border-t border-gray-200 bg-white p-6 space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-3 mb-4"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-800">₹{cartCount * 50}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="font-bold text-black text-xl">₹{cartCount * 50}</span>
                </div>
              </motion.div>

              <button className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105">
                Checkout
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gray-100 text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  )
}

function ProductCard({ product, index, onAddToCart }: { product: Product, index: number, onAddToCart?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded">
            New
          </div>
        )}
        {product.isBestSeller && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Best seller
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium mb-1">{product.name}</h3>
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-lg font-semibold">₹{product.price}</span>
        {product.originalPrice && (
          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
        )}
      </div>
      {onAddToCart && (
        <button
          onClick={onAddToCart}
          className="w-full bg-black text-white py-2 text-xs hover:bg-gray-800 transition rounded"
        >
          Add to Cart
        </button>
      )}
    </motion.div>
  )
}

function CollectionCard({ collection, index }: { collection: Collection, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="mb-16"
    >
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h3 className="text-3xl font-light mb-6">{collection.title}</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{collection.description}</p>
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Pricing start from:</p>
            <p className="text-2xl font-semibold">{collection.priceRange}</p>
          </div>
          <a href="#collections" className="bg-black text-white px-8 py-3 text-sm hover:bg-gray-800 transition block w-fit">
            All collections
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {collection.images.map((image: string, i: number) => (
            <img
              key={i}
              src={image}
              alt=""
              className="w-full h-64 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function FeatureCard({ title, description, features, image }: { title: string, description: string, features: string[], image: string }) {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center py-20">
      <div>
        <h3 className="text-4xl font-light mb-6">{title}</h3>
        <p className="text-gray-600 mb-8 leading-relaxed">{description}</p>
        <div className="space-y-3">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <img src={image} alt="" className="w-full h-80 object-cover rounded-lg" />
        <img src={image} alt="" className="w-full h-80 object-cover rounded-lg mt-8" />
      </div>
    </div>
  )
}

// ---------------- PAGE ----------------

export default function Home() {
  const [cartCount, setCartCount] = useState(0)
  const [showCart, setShowCart] = useState(false)

  const addToCart = () => {
    setCartCount(cartCount + 1)
  }

  const removeFromCart = () => {
    if (cartCount > 0) {
      setCartCount(cartCount - 1)
    }
  }

  const toggleCart = () => {
    setShowCart(!showCart)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartCount={cartCount} onToggleCart={toggleCart} showCart={showCart} />
      <CartSidebar isOpen={showCart} onClose={toggleCart} cartCount={cartCount} onRemoveItem={removeFromCart} />

      {/* Hero */}
      <section id="home" className="pt-24 pb-20 px-6 relative bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', backgroundAttachment: 'fixed', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-light tracking-wider mb-8 text-gray-100"
          >
            Premium wear for modern living
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
          >
            Discover our new range of soft clothes made for your daily look and your best days with the finest fabrics.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center space-x-6 mt-12"
          >
            <a href="#collections" className="bg-gray-800 text-white px-8 py-4 text-sm hover:bg-gray-700 transition block">
              See all collections
            </a>
            <a href="#contact" className="border border-gray-800 bg-gray-900 text-white px-8 py-4 text-sm hover:bg-gray-700 transition block text-center">
              Contact us
            </a>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-light mb-4">Fresh fits in our latest drop</h2>
              <p className="text-gray-600">New arrivals</p>
            </div>
            <a href="#collections" className="bg-black text-white px-6 py-3 text-sm hover:bg-gray-800 transition">
              See all collections
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {newArrivals.map((product, i) => (
              <ProductCard key={i} product={product} index={i} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-6 relative bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', backgroundAttachment: 'fixed', backgroundSize: '150%', backgroundPosition: 'center center' }}>
        <div className="absolute inset-0 bg-white/25"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-light mb-8 text-gray-100"
          >
            Defining modern style
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-200 leading-relaxed mb-12"
          >
            A decade ago, we set out to redefine the modern silhouette. Today, we merge urban utility with high-end aesthetics in a resilient, beautiful collection.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center space-x-6"
          >
            <a href="#about" className="bg-gray-800 text-white px-8 py-3 text-sm hover:bg-gray-700 transition">
              More about us
            </a>
            <a href="#contact" className="border border-gray-800 bg-gray-900 text-white px-8 py-3 text-sm hover:bg-gray-700 transition">
              Contact us
            </a>
          </motion.div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light mb-4">Our signature best selling pieces</h2>
            <p className="text-gray-600">Best sellers</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {bestSellers.map((product, i) => (
              <ProductCard key={i} product={product} index={i} onAddToCart={addToCart} />
            ))}
          </div>
          <div className="text-center mt-12">
            <a href="#collections" className="bg-black text-white px-8 py-3 text-sm hover:bg-gray-800 transition">
              See all collections
            </a>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section id="collections" className="py-20 px-6 relative bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', backgroundAttachment: 'fixed' }}>
        <div className="absolute inset-0 bg-white/70"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-4">Modern collections defined by simplicity</h2>
            <p className="text-gray-600">Our Collections</p>
          </div>
          {collections.map((collection, i) => (
            <CollectionCard key={i} collection={collection} index={i} />
          ))}
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-8">The voice of quality</h2>
          <p className="text-gray-600 mb-12 leading-relaxed">
            Experience the difference through the words of customers who value premium fabrics and timeless design.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-gray-600 mb-6 leading-relaxed">
              &ldquo;The premium quality of the men&apos;s collection is truly unmatched lately. The fabrics feel incredibly premium and soft. This specific tailored fit is perfect for my busy office. A very sharp look. I love it every day.&rdquo;
            </p>
            <div className="flex items-center justify-center space-x-4">
              <img
                src="https://framerusercontent.com/images/UDfLjRvzk0xpuvTb0EisZ50R4B8.png?width=512&height=512"
                alt="James Carter"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="font-semibold">James Carter</p>
                <p className="text-sm text-gray-500">Creative Director</p>
              </div>
            </div>
            <div className="mt-6 text-yellow-400">
              ★★★★★ <span className="text-gray-600 text-sm ml-2">4.9/5 from 1k+ reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-light mb-4">Where style meets ease</h2>
            <p className="text-gray-600">What defines our wear</p>
          </div>

          <FeatureCard
            title="Everyday Comfort"
            description="Designed to feel natural on the body throughout long, active days."
            features={["All-day wear", "Comfort", "Relaxed fit"]}
            image="https://framerusercontent.com/images/a7qNl1CXTOrgB91iOnO8iwyMrI.jpeg?scale-down-to=512&width=1200&height=1200"
          />

          <FeatureCard
            title="Modern Silhouettes"
            description="Contemporary shapes balance structure & ease for confident everyday styling."
            features={["Balanced fit", "Modern", "Structured"]}
            image="https://framerusercontent.com/images/JBfpcQ5zwrSJimngcpAyoOiP1Hk.png?scale-down-to=1024&width=840&height=1200"
          />

          <FeatureCard
            title="Effortless Styling"
            description="Pieces work together naturally, making daily outfit choices simple & intuitive."
            features={["Versatile", "Easy to style", "Layered"]}
            image="https://framerusercontent.com/images/h5mjcigkuGzHUrDKNZj4VOiAg.jpeg?scale-down-to=1024&width=686&height=1200"
          />

          <FeatureCard
            title="Daily Essentials"
            description="Core clothing pieces designed for frequent wear across modern everyday routines."
            features={["Core pieces", "Everyday", "Wearable"]}
            image="https://framerusercontent.com/images/o8BbZ7Bmf99hekDMhLBtBkxBoY.jpeg?scale-down-to=512&width=800&height=708"
          />

          <FeatureCard
            title="Wearable Design"
            description="Design decisions focused on comfort, fit, and real-life wearability."
            features={["Practical", "Functional", "Adaptable"]}
            image="https://framerusercontent.com/images/PHhxud3IFjLeAUBKSfIjoU.jpg?scale-down-to=1024&width=1536&height=2304"
          />

          <FeatureCard
            title="Clean Aesthetic"
            description="Designed to feel natural on the body throughout long, active days."
            features={["Clean lines", "Minimal", "Timeless"]}
            image="https://framerusercontent.com/images/ywPSLgFGyM72gZm0DNOvWwaoyHQ.jpeg?scale-down-to=512&width=1200&height=1200"
          />
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-light mb-4">Elevating your daily style journey</h2>
              <p className="text-gray-600">ELUEE Voice</p>
            </div>
            <a href="#blog" className="bg-black text-white px-6 py-3 text-sm hover:bg-gray-800 transition">
              Read all blogs
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg">
              <img src="https://framerusercontent.com/images/UDfLjRvzk0xpuvTb0EisZ50R4B8.png?width=512&height=512" alt="" className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="text-lg font-semibold mb-2">How to master the art of minimal street style</h3>
              <p className="text-gray-600 text-sm mb-4">Build a timeless, comfortable wardrobe with high-quality fabrics, muted tones, and effortless oversized fits.</p>
              <p className="text-xs text-gray-500">8 min read • Jan 29, 2026</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <img src="https://framerusercontent.com/images/UDfLjRvzk0xpuvTb0EisZ50R4B8.png?width=512&height=512" alt="" className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="text-lg font-semibold mb-2">Elevate everyday outfits using modern minimalist styling</h3>
              <p className="text-gray-600 text-sm mb-4">8 min read • 12/30/25</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <img src="https://framerusercontent.com/images/UDfLjRvzk0xpuvTb0EisZ50R4B8.png?width=512&height=512" alt="" className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="text-lg font-semibold mb-2">Build a capsule wardrobe that works year round</h3>
              <p className="text-gray-600 text-sm mb-4">5 min read • 11/22/25</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light mb-4">See our community in modern silhouettes</h2>
            <p className="text-gray-600">Stay connected</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <img src="https://framerusercontent.com/images/3BJsJKp6d3GMb73lMFLvun3bVxE.png?scale-down-to=1024&width=1082&height=1200" alt="" className="w-full h-64 object-cover rounded-lg" />
            <img src="https://framerusercontent.com/images/Q2qaxWvHcpcMDMRF6r6oA7jcK9Q.jpg?scale-down-to=512&width=920&height=878" alt="" className="w-full h-64 object-cover rounded-lg" />
            <img src="https://framerusercontent.com/images/jz6J8tN19rBotBJ08ib9LED2s8.png?scale-down-to=1024&width=900&height=1200" alt="" className="w-full h-64 object-cover rounded-lg" />
            <img src="https://framerusercontent.com/images/U7CtuDK0AXUNTwGdENumrlmdyk.png?width=965&height=1024" alt="" className="w-full h-64 object-cover rounded-lg" />
          </div>
          <div className="text-center">
            <a href="#collections" className="bg-black text-white px-8 py-3 text-sm hover:bg-gray-800 transition mr-4">
              See collections
            </a>
            <a href="#contact" className="border border-black px-8 py-3 text-sm hover:bg-black hover:text-white transition">
              Contact us
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-4">Subscribe to our newsletter</h2>
          <p className="text-gray-300 mb-8">Stay connected with our latest updates and exclusive offers.</p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white text-black rounded-l-lg"
            />
            <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 transition rounded-r-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="relative h-10 w-10 flex items-center justify-center">
                  <img src="/eluee.logo.jpeg" alt="ELUEE Logo" className="h-full w-auto object-contain" />
                </div>
                <div className="text-2xl font-light tracking-wider">ELUEE</div>
              </div>
              <p className="text-gray-400 mb-6">Premium digital services crafted with minimal design and maximum impact.</p>
              <div className="flex space-x-4">
                <a href="https://t.me/abbaszaidi10" target="_blank" className="text-gray-400 hover:text-white">Telegram</a>
                <a href="https://instagram.com/eluue2547" target="_blank" className="text-gray-400 hover:text-white">Instagram</a>
                <a href="tel:+919457111036" className="text-gray-400 hover:text-white">Call</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-gray-400">
            <a href="#home" className="block hover:text-white">Home</a>
            <a href="#about" className="block hover:text-white">About</a>
            <a href="#collections" className="block hover:text-white">Shop</a>
            <a href="#blog" className="block hover:text-white">Blog</a>
            <a href="https://instagram.com/eluue2547" target="_blank" className="block hover:text-white">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white">Men&apos;s</a>
                <a href="#" className="block hover:text-white">Women&apos;s</a>
                <a href="#" className="block hover:text-white">Children&apos;s</a>
                <a href="#" className="block hover:text-white">Accessories</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <div className="space-y-3 text-gray-400">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <a href="mailto:eluue2547@gmail.com" className="block hover:text-white transition">eluue2547@gmail.com</a>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <a href="tel:+919457111036" className="block hover:text-white transition">+91 9457111036</a>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Telegram</p>
                  <a href="https://t.me/abbaszaidi10" target="_blank" className="block hover:text-white transition">@abbaszaidi10</a>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Instagram</p>
                  <a href="https://instagram.com/eluue2547" target="_blank" className="block hover:text-white transition">@eluue2547</a>
                </div>
                <p className="text-xs text-gray-500 mt-3">📍 India</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2026 ELUEE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
