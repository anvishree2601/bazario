import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import BottomNav from '../components/BottomNav'
import ProductCard from '../components/ProductCard'
import { useApp } from '../context/AppContext'
import { products, banners, limitedOffers } from '../data/products'

export default function Home() {
  const { interests } = useApp()
  const [bannerIndex, setBannerIndex] = useState(0)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false)
    }
    if (filterOpen) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [filterOpen])

  useEffect(() => {
    const t = setInterval(() => {
      setBannerIndex(i => (i + 1) % banners.length)
    }, 5000)
    return () => clearInterval(t)
  }, [])

  const personalizedProducts = interests.length > 0
    ? products.filter(p => interests.includes(p.category))
    : products

  const filteredProducts = personalizedProducts.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || p.category === filter
    return matchSearch && matchFilter
  })

  const categories = ['all', ...new Set(products.map(p => p.category))]

  return (
    <div className="home-page">
      <NavBar />
      <div className="home-content">
        <div className="search-section">
          <div className="search-bar">
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="filter-wrapper" ref={filterRef}>
              <button
                type="button"
                className="filter-icon-btn"
                onClick={() => setFilterOpen(f => !f)}
                aria-label="Filter"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </button>
              {filterOpen && (
                <div className="filter-dropdown">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      className={filter === cat ? 'active' : ''}
                      onClick={() => { setFilter(cat); setFilterOpen(false); }}
                    >
                      {cat === 'all' ? 'All Categories' : cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="banner-slider">
          <div
            className="banner-track"
            style={{ transform: `translateX(-${bannerIndex * 100}%)` }}
          >
            {banners.map(b => (
              <div key={b.id} className="banner-slide">
                <img src={b.image} alt={b.title} />
                <div className="banner-overlay">
                  <h2>{b.title}</h2>
                  <p>{b.subtitle}</p>
                  <Link to="/home" className="banner-cta">{b.cta}</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="banner-dots">
            {banners.map((_, i) => (
              <button
                key={i}
                className={i === bannerIndex ? 'active' : ''}
                onClick={() => setBannerIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </section>

        <section className="limited-offers">
          <h2>Limited Time Offers</h2>
          <div className="products-grid">
            {limitedOffers.map(p => (
              <ProductCard key={p.id} product={p} showDiscount />
            ))}
          </div>
        </section>

        <section className="recommendations">
          <h2>Personalized For You</h2>
          <div className="products-grid">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
      <BottomNav />
      <style>{`
        .home-page { min-height: 100vh; background: var(--bg-alt); padding-bottom: 80px; }
        .home-content { max-width: 1200px; margin: 0 auto; padding: 24px; }
        .search-section { margin-bottom: 24px; }
        .search-bar {
          display: flex;
          gap: 12px;
          max-width: 600px;
        }
        .search-bar input {
          flex: 1;
          padding: 14px 20px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 1rem;
          font-family: inherit;
        }
        .search-bar input:focus {
          outline: none;
          border-color: #FF4800;
        }
        .filter-wrapper { position: relative; }
        .filter-icon-btn {
          padding: 14px 18px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          background: white;
          color: #666;
          display: flex;
          align-items: center;
        }
        .filter-icon-btn:hover {
          border-color: #FF4800;
          color: #FF4800;
        }
        .filter-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: white;
          border-radius: 10px;
          box-shadow: var(--shadow);
          padding: 8px;
          min-width: 180px;
          z-index: 50;
        }
        .filter-dropdown button {
          display: block;
          width: 100%;
          padding: 10px 16px;
          text-align: left;
          border-radius: 8px;
          font-size: 0.95rem;
          background: none;
          color: #333;
        }
        .filter-dropdown button:hover {
          background: #fff5f0;
          color: #FF4800;
        }
        .filter-dropdown button.active {
          background: #fff5f0;
          color: #FF4800;
          font-weight: 700;
        }
        .banner-slider {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 40px;
          height: 320px;
        }
        .banner-track {
          display: flex;
          transition: transform 0.5s ease;
          height: 100%;
        }
        .banner-slide {
          flex: 0 0 100%;
          position: relative;
          height: 100%;
        }
        .banner-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 60%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px;
          color: white;
        }
        .banner-overlay h2 { font-size: 2rem; margin-bottom: 8px; }
        .banner-overlay p { font-size: 1.1rem; margin-bottom: 20px; opacity: 0.9; }
        .banner-cta {
          display: inline-block;
          padding: 12px 28px;
          background: #FF4800;
          color: white;
          font-weight: 700;
          border-radius: 8px;
          width: fit-content;
          transition: all 0.2s;
        }
        .banner-cta:hover {
          background: white;
          color: #FF4800;
        }
        .banner-dots {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }
        .banner-dots button {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          transition: all 0.2s;
        }
        .banner-dots button.active {
          background: #FF4800;
          width: 28px;
          border-radius: 5px;
        }
        .limited-offers, .recommendations { margin-bottom: 48px; }
        .limited-offers h2, .recommendations h2 {
          font-size: 1.5rem;
          margin-bottom: 20px;
          color: #FF4800;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 24px;
        }
        @media (max-width: 768px) {
          .banner-slider { height: 220px; }
          .banner-overlay { padding: 24px; }
          .banner-overlay h2 { font-size: 1.5rem; }
          .search-bar { flex-direction: column; }
        }
      `}</style>
    </div>
  )
}
