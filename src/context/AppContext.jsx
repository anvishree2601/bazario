import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const INTERESTS_KEY = 'bazario_interests'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState(null) // 'buyer' | 'seller'
  const [interests, setInterestsState] = useState(() => {
    try {
      const stored = localStorage.getItem(INTERESTS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [orders, setOrders] = useState([])

  const setInterests = useCallback((val) => {
    setInterestsState(prev => typeof val === 'function' ? val(prev) : val)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(INTERESTS_KEY, JSON.stringify(interests))
    } catch (_) {}
  }, [interests])
  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id)
      if (existing) {
        return prev.map(p =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + quantity }
            : p
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }, [])

  const updateCartQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(p => p.id !== productId))
    } else {
      setCart(prev =>
        prev.map(p =>
          p.id === productId ? { ...p, quantity } : p
        )
      )
    }
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(p => p.id !== productId))
  }, [])

  const toggleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) return prev.filter(p => p.id !== product.id)
      return [...prev, product]
    })
  }, [])

  const isInWishlist = useCallback((productId) => {
    return wishlist.some(p => p.id === productId)
  }, [wishlist])

  const addOrder = useCallback((order) => {
    const newOrder = {
      ...order,
      id: Date.now(),
      date: new Date().toISOString(),
      status: 'Confirmed'
    }
    setOrders(prev => [newOrder, ...prev])
    setCart([])
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setUserType(null)
    setInterestsState([])
  }, [])

  const value = {
    user,
    setUser,
    userType,
    setUserType,
    interests,
    setInterests,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    wishlist,
    toggleWishlist,
    isInWishlist,
    orders,
    addOrder,
    logout
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
