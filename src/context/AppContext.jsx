import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { api, setToken } from '../api/client'

const INTERESTS_KEY = 'bazario_interests'

function mapCartItem(p) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    category: p.category,
    description: p.description,
    quantity: p.quantity
  }
}

function mapOrdersFromApi(list) {
  return (list || []).map((o) => ({
    ...o,
    date: o.date || o.created_at,
    items: (o.items || []).map((it) => ({
      ...it,
      image: it.image,
      name: it.name,
      price: it.price,
      quantity: it.quantity
    }))
  }))
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState(null)
  const [interests, setInterestsState] = useState(() => {
    try {
      const stored = localStorage.getItem(INTERESTS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [orders, setOrders] = useState([])
  const apiBuyerRef = useRef(false)

  useEffect(() => {
    try {
      localStorage.setItem(INTERESTS_KEY, JSON.stringify(interests))
    } catch (_) {}
  }, [interests])

  useEffect(() => {
    if (!user?.id || userType !== 'buyer') {
      apiBuyerRef.current = false
      return
    }
    let cancelled = false
    apiBuyerRef.current = true
    ;(async () => {
      try {
        const [cartData, wishData, orderData, profile] = await Promise.all([
          api.getCart(user.id),
          api.getWishlist(user.id),
          api.getOrders(user.id),
          api.getBuyerProfile(user.id).catch(() => null)
        ])
        if (cancelled) return
        setCart((cartData || []).map(mapCartItem))
        setWishlist(wishData || [])
        setOrders(mapOrdersFromApi(orderData))
        if (profile && profile.interests != null) {
          const ints = Array.isArray(profile.interests) ? profile.interests : []
          setInterestsState(ints)
        }
      } catch (e) {
        console.warn('Buyer API sync failed (using local state)', e)
        apiBuyerRef.current = false
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user?.id, userType])

  const setInterests = useCallback((val) => {
    setInterestsState((prev) => {
      const next = typeof val === 'function' ? val(prev) : val
      if (user?.id && userType === 'buyer') {
        api.updateBuyerProfile(user.id, { interests: next }).catch(() => {})
      }
      return next
    })
  }, [user?.id, userType])

  const addToCart = useCallback(
    async (product, quantity = 1) => {
      const pid = product.id
      setCart((prev) => {
        const existing = prev.find((p) => p.id === pid)
        if (existing) {
          return prev.map((p) => (p.id === pid ? { ...p, quantity: p.quantity + quantity } : p))
        }
        return [...prev, { ...product, quantity }]
      })
      if (user?.id && userType === 'buyer') {
        try {
          await api.postCart(user.id, pid, quantity)
          const cartData = await api.getCart(user.id)
          setCart((cartData || []).map(mapCartItem))
        } catch (e) {
          console.warn('addToCart API failed', e)
        }
      }
    },
    [user, userType]
  )

  const updateCartQuantity = useCallback(
    async (productId, quantity) => {
      if (quantity <= 0) {
        setCart((prev) => prev.filter((p) => p.id !== productId))
        if (user?.id && userType === 'buyer') {
          try {
            await api.deleteCartItem(user.id, productId)
            const cartData = await api.getCart(user.id)
            setCart((cartData || []).map(mapCartItem))
          } catch (e) {
            console.warn(e)
          }
        }
        return
      }
      setCart((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, quantity } : p))
      )
      if (user?.id && userType === 'buyer') {
        try {
          await api.putCartItem(user.id, productId, quantity)
          const cartData = await api.getCart(user.id)
          setCart((cartData || []).map(mapCartItem))
        } catch (e) {
          console.warn(e)
        }
      }
    },
    [user, userType]
  )

  const removeFromCart = useCallback(
    async (productId) => {
      setCart((prev) => prev.filter((p) => p.id !== productId))
      if (user?.id && userType === 'buyer') {
        try {
          await api.deleteCartItem(user.id, productId)
          const cartData = await api.getCart(user.id)
          setCart((cartData || []).map(mapCartItem))
        } catch (e) {
          console.warn(e)
        }
      }
    },
    [user, userType]
  )

  const toggleWishlist = useCallback(
    async (product) => {
      const pid = product.id
      const exists = wishlist.some((p) => p.id === pid)
      setWishlist((prev) => {
        if (exists) return prev.filter((p) => p.id !== pid)
        return [...prev, product]
      })
      if (user?.id && userType === 'buyer') {
        try {
          if (exists) await api.deleteWishlist(user.id, pid)
          else await api.postWishlist(user.id, pid)
          const list = await api.getWishlist(user.id)
          setWishlist(list || [])
        } catch (e) {
          console.warn(e)
        }
      }
    },
    [user, userType, wishlist]
  )

  const isInWishlist = useCallback(
    (productId) => wishlist.some((p) => p.id === productId),
    [wishlist]
  )

  const addOrder = useCallback(
    async (order) => {
      const { items, total, subtotal, shipping } = order
      if (user?.id && userType === 'buyer') {
        try {
          await api.postOrder(user.id, {
            items,
            total,
            subtotal,
            shipping: shipping ?? 0
          })
          const orderData = await api.getOrders(user.id)
          setOrders(mapOrdersFromApi(orderData))
          const cartData = await api.getCart(user.id)
          setCart((cartData || []).map(mapCartItem))
          return
        } catch (e) {
          console.warn('postOrder API failed', e)
        }
      }
      const localOrder = {
        ...order,
        id: Date.now(),
        date: new Date().toISOString(),
        status: 'Confirmed'
      }
      setOrders((prev) => [localOrder, ...prev])
      setCart([])
    },
    [user, userType]
  )

  const logout = useCallback(() => {
    setUser(null)
    setUserType(null)
    setInterestsState([])
    setToken(null)
    setCart([])
    setWishlist([])
    setOrders([])
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
