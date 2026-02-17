import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Interests from './pages/Interests'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Orders from './pages/Orders'
import Account from './pages/Account'
import SellerDashboard from './pages/SellerDashboard'

function ProtectedBuyer({ children }) {
  const { user, userType } = useApp()
  if (!user) return <Navigate to="/login" replace />
  if (userType !== 'buyer') return <Navigate to="/" replace />
  return children
}

function BuyerLoginRedirect() {
  const { user, userType } = useApp()
  if (user && userType === 'buyer') return <Navigate to="/home" replace />
  return <Login buyer />
}

function ProtectedSeller({ children }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login/seller" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<BuyerLoginRedirect />} />
      <Route path="/login/seller" element={<Login />} />
      <Route
        path="/interests"
        element={
          <ProtectedBuyer>
            <Interests />
          </ProtectedBuyer>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedBuyer>
            <Home />
          </ProtectedBuyer>
        }
      />
      <Route
        path="/product/:id"
        element={
          <ProtectedBuyer>
            <ProductDetails />
          </ProtectedBuyer>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedBuyer>
            <Cart />
          </ProtectedBuyer>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedBuyer>
            <Wishlist />
          </ProtectedBuyer>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedBuyer>
            <Orders />
          </ProtectedBuyer>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedBuyer>
            <Account />
          </ProtectedBuyer>
        }
      />
      <Route
        path="/seller/dashboard"
        element={
          <ProtectedSeller>
            <SellerDashboard />
          </ProtectedSeller>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}
