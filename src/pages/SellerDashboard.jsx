import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

export default function SellerDashboard() {
  return (
    <div className="seller-page">
      <header className="seller-header">
        <Logo size={44} />
        <Link to="/" className="back-home">← Back to Home</Link>
      </header>
      <main className="seller-main">
        <h1>Seller Dashboard</h1>
        <p className="seller-subtitle">
          Manage your shop, inventory, and orders. Seller features coming soon.
        </p>
        <Link to="/login/buyer">
          <button className="switch-buyer">Switch to Buyer</button>
        </Link>
      </main>
      <style>{`
        .seller-page { min-height: 100vh; background: #f8f8f8; }
        .seller-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: white;
          box-shadow: var(--shadow);
        }
        .back-home {
          color: #666;
          font-weight: 600;
        }
        .back-home:hover { color: #FF4800; }
        .seller-main {
          max-width: 600px;
          margin: 80px auto;
          text-align: center;
          padding: 24px;
        }
        .seller-main h1 { color: #FF4800; margin-bottom: 12px; }
        .seller-subtitle {
          color: #666;
          margin-bottom: 32px;
        }
        .switch-buyer {
          padding: 14px 32px;
          background: #FF4800;
          color: white;
          font-weight: 700;
          border-radius: 10px;
        }
        .switch-buyer:hover {
          background: #e03f00;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}
