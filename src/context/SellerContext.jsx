import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useApp } from './AppContext'
import { api } from '../api/client'

const KEYS = {
  profile: 'bazario_seller_profile',
  products: 'bazario_seller_products',
  orders: 'bazario_seller_orders'
}

const defaultProfile = () => ({
  name: '',
  shopName: 'My Shop',
  email: ''
})

const defaultMockProducts = () => JSON.parse(JSON.stringify([
  { id: 'sp-1', name: 'Handmade Ceramic Mug', price: 599, category: 'Home & Garden', description: 'Set of 2 ceramic mugs.', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400', createdAt: new Date().toISOString() },
  { id: 'sp-2', name: 'Artisan Soap Pack', price: 399, category: 'Beauty', description: 'Natural ingredients.', image: 'https://images.unsplash.com/photo-1600857544200-b9f927e3f2c5?w=400', createdAt: new Date().toISOString() },
  { id: 'sp-3', name: 'Cotton Tote Bag', price: 449, category: 'Fashion', description: 'Eco-friendly tote.', image: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=400', createdAt: new Date().toISOString() }
]))

const defaultMockOrders = () => JSON.parse(JSON.stringify([
  { id: 'so-1', productName: 'Handmade Ceramic Mug', buyerName: 'Amit Kumar', status: 'Shipped', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'so-2', productName: 'Artisan Soap Pack', buyerName: 'Priya Sharma', status: 'Confirmed', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'so-3', productName: 'Cotton Tote Bag', buyerName: 'Rahul Verma', status: 'Delivered', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() }
]))

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback()
    return JSON.parse(raw)
  } catch {
    return fallback()
  }
}

function mapSellerOrders(list) {
  return (list || []).map((o) => ({
    id: o.id,
    productName: o.productName || o.product_name || '—',
    buyerName: o.buyerName || o.buyer_name,
    status: o.status,
    date: o.date || o.created_at
  }))
}

const SellerContext = createContext(null)

export function SellerProvider({ children }) {
  const { user, userType } = useApp()
  const [profile, setProfileState] = useState(() => loadJson(KEYS.profile, defaultProfile))
  const [products, setProductsState] = useState(() => {
    const loaded = loadJson(KEYS.products, () => null)
    return loaded && Array.isArray(loaded) && loaded.length > 0 ? loaded : defaultMockProducts()
  })
  const [orders, setOrdersState] = useState(() => {
    const loaded = loadJson(KEYS.orders, () => null)
    return loaded && Array.isArray(loaded) && loaded.length > 0 ? loaded : defaultMockOrders()
  })
  const [apiReady, setApiReady] = useState(false)

  useEffect(() => {
    if (!products.length) return
    try {
      localStorage.setItem(KEYS.products, JSON.stringify(products))
    } catch (_) {}
  }, [products])

  useEffect(() => {
    if (!orders.length) return
    try {
      localStorage.setItem(KEYS.orders, JSON.stringify(orders))
    } catch (_) {}
  }, [orders])

  useEffect(() => {
    try {
      localStorage.setItem(KEYS.profile, JSON.stringify(profile))
    } catch (_) {}
  }, [profile])

  useEffect(() => {
    if (userType !== 'seller' || !user?.id) {
      setApiReady(false)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const [prof, prods, ords] = await Promise.all([
          api.getSellerProfile(user.id),
          api.getSellerProducts(user.id),
          api.getSellerOrders(user.id)
        ])
        if (cancelled) return
        setProfileState({
          name: prof.ownerName || prof.name || '',
          shopName: prof.shopName || '',
          email: prof.email || '',
          ownerName: prof.ownerName
        })
        setProductsState(
          (prods || []).map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            category: p.category,
            description: p.description || '',
            image: p.image || (p.image_urls && p.image_urls[0]) || '',
            createdAt: p.createdAt || p.created_at
          }))
        )
        setOrdersState(mapSellerOrders(ords))
        setApiReady(true)
      } catch (e) {
        console.warn('Seller API sync failed (using local/mock data)', e)
        setApiReady(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [userType, user?.id])

  const setProfile = useCallback(
    (val) => {
      setProfileState((prev) => {
        const next = typeof val === 'function' ? val(prev) : { ...prev, ...val }
        if (apiReady && user?.id) {
          api
            .updateSellerProfile(user.id, {
              shopName: next.shopName,
              ownerName: next.name || next.ownerName
            })
            .catch(() => {})
        }
        return next
      })
    },
    [apiReady, user?.id]
  )

  const syncFromAuth = useCallback(({ email, name, shopName, ownerName }) => {
    setProfileState((prev) => ({
      ...prev,
      email: email || prev.email,
      name: name || ownerName || prev.name,
      ownerName: ownerName || name || prev.ownerName,
      shopName: shopName || prev.shopName || 'My Shop'
    }))
  }, [])

  const addProduct = useCallback(
    async (product) => {
      const payload = {
        name: product.name,
        category: product.category,
        price: Number(product.price),
        description: product.description || '',
        imageUrl: product.image || ''
      }
      if (apiReady && user?.id) {
        try {
          await api.postSellerProduct(user.id, payload)
          const prods = await api.getSellerProducts(user.id)
          setProductsState(
            (prods || []).map((p) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              category: p.category,
              description: p.description || '',
              image: p.image || (p.image_urls && p.image_urls[0]) || '',
              createdAt: p.createdAt || p.created_at
            }))
          )
          return
        } catch (e) {
          console.warn(e)
        }
      }
      const id = `sp-${Date.now()}`
      setProductsState((prev) => [
        ...prev,
        { ...product, id, price: Number(product.price), createdAt: new Date().toISOString() }
      ])
    },
    [apiReady, user?.id]
  )

  const updateProduct = useCallback(
    async (id, updates) => {
      const numId = Number(id)
      if (apiReady && user?.id && !Number.isNaN(numId)) {
        try {
          await api.putSellerProduct(user.id, numId, {
            name: updates.name,
            category: updates.category,
            price: updates.price != null ? Number(updates.price) : undefined,
            description: updates.description,
            imageUrl: updates.image
          })
          const prods = await api.getSellerProducts(user.id)
          setProductsState(
            (prods || []).map((p) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              category: p.category,
              description: p.description || '',
              image: p.image || (p.image_urls && p.image_urls[0]) || '',
              createdAt: p.createdAt || p.created_at
            }))
          )
          return
        } catch (e) {
          console.warn(e)
        }
      }
      setProductsState((prev) =>
        prev.map((p) =>
          String(p.id) === String(id)
            ? { ...p, ...updates, price: updates.price != null ? Number(updates.price) : p.price }
            : p
        )
      )
    },
    [apiReady, user?.id]
  )

  const deleteProduct = useCallback(
    async (id) => {
      const numId = Number(id)
      if (apiReady && user?.id && !Number.isNaN(numId)) {
        try {
          await api.deleteSellerProduct(user.id, numId)
          const prods = await api.getSellerProducts(user.id)
          setProductsState(
            (prods || []).map((p) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              category: p.category,
              description: p.description || '',
              image: p.image || (p.image_urls && p.image_urls[0]) || '',
              createdAt: p.createdAt || p.created_at
            }))
          )
          return
        } catch (e) {
          console.warn(e)
        }
      }
      setProductsState((prev) => prev.filter((p) => String(p.id) !== String(id)))
    },
    [apiReady, user?.id]
  )

  const updateOrderStatus = useCallback(
    async (orderId, status) => {
      const numOid = Number(orderId)
      if (apiReady && user?.id && !Number.isNaN(numOid)) {
        try {
          await api.putSellerOrder(user.id, numOid, { status })
          const ords = await api.getSellerOrders(user.id)
          setOrdersState(mapSellerOrders(ords))
          return
        } catch (e) {
          console.warn(e)
        }
      }
      setOrdersState((prev) => prev.map((o) => (String(o.id) === String(orderId) ? { ...o, status } : o)))
    },
    [apiReady, user?.id]
  )

  const value = {
    profile,
    setProfile,
    syncFromAuth,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus
  }

  return <SellerContext.Provider value={value}>{children}</SellerContext.Provider>
}

export function useSeller() {
  const ctx = useContext(SellerContext)
  if (!ctx) throw new Error('useSeller must be used within SellerProvider')
  return ctx
}
