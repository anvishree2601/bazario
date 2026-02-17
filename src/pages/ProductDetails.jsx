import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import BottomNav from '../components/BottomNav'
import ProductCard from '../components/ProductCard'
import { useApp } from '../context/AppContext'
import { products } from '../data/products'

const faqs = [
  { q: 'What is the return policy?', a: 'Items can be returned within 7 days of delivery if unused and in original packaging.' },
  { q: 'How long does shipping take?', a: 'Standard delivery takes 3-5 business days across India.' },
  { q: 'Is COD available?', a: 'Yes, Cash on Delivery is available for orders under ₹10,000.' }
]

const reviews = [
  { name: 'Amit K.', rating: 5, text: 'Excellent product! Exactly as described.', date: '2 days ago' },
  { name: 'Sneha P.', rating: 4, text: 'Good quality. Delivery was a bit delayed but acceptable.', date: '1 week ago' }
]

export default function ProductDetails() {
  const { id } = useParams()
  const { addToCart, toggleWishlist, isInWishlist } = useApp()
  const [quantity, setQuantity] = useState(1)
  const [openFaq, setOpenFaq] = useState(null)
  const [imgIndex, setImgIndex] = useState(0)

  const product = products.find(p => p.id === Number(id))
  if (!product) return <div>Product not found</div>

  const productImages = product.images || [product.image]

  const moreFromShop = products.filter(p => p.shop.id === product.shop.id && p.id !== product.id)

  const formatPrice = (n) => `₹${n.toLocaleString('en-IN')}`

  return (
    <div className="product-page">
      <NavBar />
      <BottomNav />
      <div className="product-content">
        <div className="product-layout">
          <div className="product-gallery">
            <div
              className="product-image-carousel"
              style={{ transform: `translateX(-${imgIndex * 100}%)` }}
            >
              {productImages.map((img, i) => (
                <img key={i} src={img} alt={`${product.name} ${i + 1}`} />
              ))}
            </div>
            <div className="gallery-dots">
              {productImages.map((_, i) => (
                <button
                  key={i}
                  className={i === imgIndex ? 'active' : ''}
                  onClick={() => setImgIndex(i)}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="product-info">
            <h1>{product.name}</h1>
            <div className="product-meta">
              <span className="rating">★ {product.rating}</span>
              <span className="reviews">({product.reviews} reviews)</span>
            </div>
            <p className="price">{formatPrice(product.price)}</p>
            <p className="description">{product.description}</p>

            <div className="quantity-row">
              <label>Quantity:</label>
              <div className="quantity-control">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
            </div>

            <div className="actions">
              <button
                className="add-cart"
                onClick={() => addToCart(product, quantity)}
              >
                Add to Cart
              </button>
              <button
                className={`wishlist-btn ${isInWishlist(product.id) ? 'saved' : ''}`}
                onClick={() => toggleWishlist(product)}
              >
                ♥ {isInWishlist(product.id) ? 'Saved' : 'Save'}
              </button>
            </div>

            <div className="shop-info">
              <h3>Shop Details</h3>
              <p><strong>{product.shop.name}</strong></p>
              <p>Owner: {product.shop.owner}</p>
              <div className="shop-actions">
                <button className="msg-btn">Message Shop</button>
                <button className="follow-btn">Follow Shop</button>
              </div>
            </div>
          </div>
        </div>

        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`faq-item ${openFaq === i ? 'open' : ''}`}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <h4>{faq.q}</h4>
              <p>{faq.a}</p>
            </div>
          ))}
        </section>

        <section className="reviews-section">
          <h2>Customer Reviews</h2>
          {reviews.map((r, i) => (
            <div key={i} className="review-card">
              <div className="review-header">
                <span className="reviewer">{r.name}</span>
                <span className="stars">{'★'.repeat(r.rating)}</span>
              </div>
              <p className="review-text">{r.text}</p>
              <span className="review-date">{r.date}</span>
            </div>
          ))}
        </section>

        {moreFromShop.length > 0 && (
          <section className="more-section">
            <h2>More from this Shop</h2>
            <div className="more-grid">
              {moreFromShop.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
      <style>{`
        .product-page { min-height: 100vh; background: var(--bg-alt); padding-bottom: 80px; }
        .product-content { max-width: 1200px; margin: 0 auto; padding: 24px; }
        .product-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }
        .product-gallery {
          position: relative;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow);
        }
        .product-gallery .product-image-carousel {
          display: flex;
          transition: transform 0.4s ease;
          height: 100%;
        }
        .product-gallery .product-image-carousel img {
          flex: 0 0 100%;
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
        }
        .gallery-dots {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }
        .gallery-dots button {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(0,0,0,0.3);
          transition: all 0.2s;
        }
        .gallery-dots button.active {
          background: #FF4800;
          width: 24px;
          border-radius: 6px;
        }
        .product-info h1 {
          font-size: 1.75rem;
          color: #333;
          margin-bottom: 12px;
        }
        .product-meta {
          font-size: 1rem;
          margin-bottom: 16px;
        }
        .product-meta .rating { color: #FF4800; font-weight: 700; }
        .product-meta .reviews { color: #666; }
        .price {
          font-size: 1.75rem;
          font-weight: 700;
          color: #FF4800;
          margin-bottom: 16px;
        }
        .description {
          color: #555;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .quantity-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        .quantity-row label { font-weight: 600; }
        .quantity-control {
          display: flex;
          align-items: center;
          gap: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 4px;
        }
        .quantity-control button {
          width: 36px;
          height: 36px;
          background: #f5f5f5;
          font-size: 1.2rem;
          font-weight: 700;
          border-radius: 6px;
          transition: background 0.2s;
        }
        .quantity-control button:hover { background: #FF4800; color: white; }
        .quantity-control span { min-width: 32px; text-align: center; font-weight: 700; }
        .actions {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
        }
        .add-cart {
          padding: 16px 32px;
          background: #FF4800;
          color: white;
          font-weight: 700;
          font-size: 1rem;
          border-radius: 10px;
        }
        .add-cart:hover {
          background: #e03f00;
          transform: translateY(-2px);
        }
        .wishlist-btn {
          padding: 16px 24px;
          background: white;
          color: #666;
          border: 2px solid #e0e0e0;
          font-weight: 600;
          border-radius: 10px;
        }
        .wishlist-btn:hover, .wishlist-btn.saved {
          border-color: #FF4800;
          color: #FF4800;
        }
        .shop-info {
          background: #f8f8f8;
          padding: 24px;
          border-radius: 12px;
        }
        .shop-info h3 { margin-bottom: 12px; font-size: 1.1rem; }
        .shop-info p { margin-bottom: 8px; color: #333; }
        .shop-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }
        .msg-btn, .follow-btn {
          padding: 10px 20px;
          font-weight: 600;
          border-radius: 8px;
          font-size: 0.95rem;
        }
        .msg-btn {
          background: #FF4800;
          color: white;
        }
        .msg-btn:hover { background: #e03f00; }
        .follow-btn {
          background: white;
          border: 2px solid #FF4800;
          color: #FF4800;
        }
        .follow-btn:hover { background: #fff5f0; }
        .faq-section, .reviews-section, .more-section {
          margin-bottom: 48px;
        }
        .faq-section h2, .reviews-section h2, .more-section h2 {
          font-size: 1.35rem;
          margin-bottom: 20px;
          color: #FF4800;
        }
        .faq-item {
          background: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 12px;
          cursor: pointer;
          box-shadow: var(--shadow);
          transition: all 0.2s;
        }
        .faq-item:hover { box-shadow: var(--shadow-hover); }
        .faq-item h4 { margin-bottom: 8px; color: #333; font-size: 1rem; }
        .faq-item p {
          color: #666;
          font-size: 0.95rem;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        .faq-item.open p { max-height: 200px; }
        .review-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 12px;
          box-shadow: var(--shadow);
        }
        .review-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .reviewer { font-weight: 700; }
        .stars { color: #FF4800; }
        .review-text { color: #555; margin-bottom: 8px; }
        .review-date { font-size: 0.85rem; color: #999; }
        .more-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
        @media (max-width: 768px) {
          .product-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
