import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { useApp } from '../context/AppContext'
import { useSeller } from '../context/SellerContext'
import { api, setToken } from '../api/client'

export default function Login({ buyer = false }) {
  const navigate = useNavigate()
  const { setUser, setUserType } = useApp()
  const { syncFromAuth } = useSeller()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const isBuyer = buyer

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    const name = email.split('@')[0]

    try {
      if (isBuyer) {
        const data = await api.loginBuyer(email, password)
        setToken(data.token)
        setUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name
        })
        setUserType('buyer')
        navigate('/interests')
      } else {
        const data = await api.loginSeller(email, password)
        setToken(data.token)
        setUser({
          id: data.seller.id,
          email: data.seller.email,
          name: data.seller.ownerName
        })
        setUserType('seller')
        syncFromAuth({
          email: data.seller.email,
          name: data.seller.ownerName,
          ownerName: data.seller.ownerName,
          shopName: data.seller.shopName
        })
        navigate('/seller/dashboard')
      }
    } catch (err) {
      const msg = String(err?.message || err || '')
      const offline =
        msg.includes('Failed to fetch') || msg.includes('NetworkError') || !navigator.onLine
      console.warn('Login:', msg)
      if (!offline) return
      setToken(null)
      if (isBuyer) {
        setUser({ email, name })
        setUserType('buyer')
        navigate('/interests')
      } else {
        setUser({ email, name })
        setUserType('seller')
        syncFromAuth({ email, name })
        navigate('/seller/dashboard')
      }
    }
  }

  return (
    <div className="login-page">
      <header className="login-header">
        <Link to="/">
          <Logo size={44} />
        </Link>
        <Link to="/" className="back-link">← Back</Link>
      </header>
      <main className="login-main">
        <div className="login-card">
          <h1>{isBuyer ? 'Buyer' : 'Seller'} Login</h1>
          <p className="login-subtitle">
            {isBuyer
              ? 'Sign in to discover products tailored to your interests'
              : 'Sign in to manage your shop and orders'}
          </p>
          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-btn">Sign In</button>
            <p className="login-switch">
              Want to {isBuyer ? 'sell' : 'buy'}?{' '}
              <Link to={isBuyer ? '/login/seller' : '/login'}>
                Switch to {isBuyer ? 'Seller' : 'Buyer'} Login
              </Link>
            </p>
          </form>
        </div>
      </main>
      <style>{`
        .login-page {
          min-height: 100vh;
          background: #f8f8f8;
        }
        .login-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: white;
          box-shadow: var(--shadow);
        }
        .back-link {
          color: #666;
          font-weight: 600;
          transition: color 0.2s;
        }
        .back-link:hover { color: #FF4800; }
        .login-main {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          min-height: calc(100vh - 80px);
        }
        .login-card {
          background: white;
          padding: 48px;
          border-radius: 16px;
          box-shadow: var(--shadow);
          width: 100%;
          max-width: 440px;
        }
        .login-card h1 {
          font-size: 1.75rem;
          margin-bottom: 8px;
          color: #FF4800;
        }
        .login-subtitle {
          color: #666;
          margin-bottom: 32px;
          font-size: 0.95rem;
        }
        .login-form input {
          width: 100%;
          padding: 14px 18px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 1rem;
          margin-bottom: 16px;
          font-family: inherit;
          transition: border-color 0.2s;
        }
        .login-form input:focus {
          outline: none;
          border-color: #FF4800;
        }
        .login-btn {
          width: 100%;
          padding: 16px;
          background: #FF4800;
          color: white;
          font-weight: 700;
          font-size: 1.05rem;
          border-radius: 10px;
          margin-top: 8px;
        }
        .login-btn:hover {
          background: #e03f00;
          transform: translateY(-1px);
        }
        .login-switch {
          margin-top: 24px;
          text-align: center;
          color: #666;
          font-size: 0.9rem;
        }
        .login-switch a {
          color: #FF4800;
          font-weight: 600;
        }
        .login-switch a:hover { text-decoration: underline; }
      `}</style>
    </div>
  )
}
