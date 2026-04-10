import { useNavigate } from 'react-router-dom'
import SellerLayout from '../../components/seller/SellerLayout'
import { useSeller } from '../../context/SellerContext'

export default function SellerProductsPage() {
  const navigate = useNavigate()
  const { products, deleteProduct } = useSeller()

  const formatPrice = (n) => `₹${Number(n).toLocaleString('en-IN')}`

  return (
    <SellerLayout>
      <div className="sp-head">
        <h1>Manage Products</h1>
        <button type="button" className="sp-add" onClick={() => navigate('/seller/add-product')}>
          Add Product
        </button>
      </div>
      <div className="sp-grid">
        {products.map(p => (
          <div key={p.id} className="sp-card">
            <div className="sp-img-wrap">
              <img src={p.image} alt={p.name} />
            </div>
            <div className="sp-body">
              <h3>{p.name}</h3>
              <p className="sp-price">{formatPrice(p.price)}</p>
              <p className="sp-cat">{p.category}</p>
              <div className="sp-actions">
                <button type="button" className="btn-edit" onClick={() => navigate(`/seller/edit-product/${p.id}`)}>
                  Edit
                </button>
                <button type="button" className="btn-delete" onClick={() => deleteProduct(p.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .sp-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }
        .sp-head h1 { font-size: 1.75rem; color: #FF4800; }
        .sp-add {
          padding: 12px 24px;
          background: #FF4800;
          color: white;
          font-weight: 700;
          border-radius: 10px;
        }
        .sp-add:hover { background: #e03f00; transform: translateY(-1px); }
        .sp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
        }
        .sp-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: var(--shadow, 0 2px 12px rgba(0,0,0,0.08));
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .sp-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 20px rgba(255, 72, 0, 0.15);
        }
        .sp-img-wrap {
          aspect-ratio: 4/3;
          overflow: hidden;
          background: #f0f0f0;
        }
        .sp-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .sp-body { padding: 16px; }
        .sp-body h3 { font-size: 1.05rem; color: #333; margin-bottom: 8px; }
        .sp-price { font-size: 1.15rem; font-weight: 700; color: #FF4800; margin-bottom: 4px; }
        .sp-cat { font-size: 0.85rem; color: #666; margin-bottom: 16px; }
        .sp-actions { display: flex; gap: 10px; }
        .btn-edit {
          flex: 1;
          padding: 10px;
          background: #FF4800;
          color: white;
          font-weight: 600;
          border-radius: 8px;
        }
        .btn-edit:hover { background: #e03f00; }
        .btn-delete {
          flex: 1;
          padding: 10px;
          background: white;
          color: #e03f00;
          font-weight: 600;
          border: 2px solid #e03f00;
          border-radius: 8px;
        }
        .btn-delete:hover { background: #fff5f0; }
      `}</style>
    </SellerLayout>
  )
}
