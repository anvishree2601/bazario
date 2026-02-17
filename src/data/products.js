export const categories = [
  'Electronics', 'Fashion', 'Home & Garden', 'Books', 'Sports',
  'Beauty', 'Toys', 'Food & Beverages', 'Art', 'Music'
]

export const products = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600'
    ],
    category: 'Electronics',
    rating: 4.5,
    reviews: 128,
    description: 'Premium sound quality with 30-hour battery life. Comfortable over-ear design perfect for all-day use.',
    shop: { id: 1, name: 'TechHub Store', owner: 'Rahul Sharma' }
  },
  {
    id: 2,
    name: 'Classic Leather Handbag',
    price: 4599,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600'
    ],
    category: 'Fashion',
    rating: 4.8,
    reviews: 89,
    description: 'Handcrafted genuine leather handbag. Timeless design with ample storage.',
    shop: { id: 2, name: 'Urban Chic', owner: 'Priya Mehta' }
  },
  {
    id: 3,
    name: 'Smart Watch Pro',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600'
    ],
    category: 'Electronics',
    rating: 4.6,
    reviews: 256,
    description: 'Track fitness, receive notifications, and stay connected. Water-resistant design.',
    shop: { id: 1, name: 'TechHub Store', owner: 'Rahul Sharma' }
  },
  {
    id: 4,
    name: 'Organic Cotton T-Shirt',
    price: 899,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600'
    ],
    category: 'Fashion',
    rating: 4.4,
    reviews: 312,
    description: 'Soft, sustainable cotton. Available in multiple colors. Perfect for everyday wear.',
    shop: { id: 2, name: 'Urban Chic', owner: 'Priya Mehta' }
  },
  {
    id: 5,
    name: 'Designer Coffee Table',
    price: 12999,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600'
    ],
    category: 'Home & Garden',
    rating: 4.7,
    reviews: 45,
    description: 'Modern minimalist coffee table. Solid wood construction with elegant finish.',
    shop: { id: 3, name: 'Home Elegance', owner: 'Anita Verma' }
  },
  {
    id: 6,
    name: 'Yoga Mat Premium',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600',
      'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600'
    ],
    category: 'Sports',
    rating: 4.5,
    reviews: 178,
    description: 'Non-slip, eco-friendly yoga mat. Extra thick for comfort during workouts.',
    shop: { id: 4, name: 'FitLife Store', owner: 'Vikram Singh' }
  },
  {
    id: 7,
    name: 'Skincare Set - 5 Piece',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600',
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600'
    ],
    category: 'Beauty',
    rating: 4.9,
    reviews: 234,
    description: 'Complete skincare routine. Natural ingredients. Suitable for all skin types.',
    shop: { id: 5, name: 'Glow Beauty', owner: 'Neha Gupta' }
  },
  {
    id: 8,
    name: 'Portable Power Bank',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600',
      'https://images.unsplash.com/photo-1609091839944-e2a90dc836ba?w=600',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600'
    ],
    category: 'Electronics',
    rating: 4.3,
    reviews: 567,
    description: '20000mAh capacity. Fast charging support. Compact and travel-friendly.',
    shop: { id: 1, name: 'TechHub Store', owner: 'Rahul Sharma' }
  }
]

export const banners = [
  {
    id: 1,
    title: 'Summer Sale',
    subtitle: 'Up to 50% Off',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
    cta: 'Shop Now'
  },
  {
    id: 2,
    title: 'New Arrivals',
    subtitle: 'Fresh Styles Every Week',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
    cta: 'Explore'
  },
  {
    id: 3,
    title: 'Limited Time Offers',
    subtitle: 'Don\'t Miss Out',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
    cta: 'View Deals'
  }
]

export const limitedOffers = products.slice(0, 4).map(p => ({
  ...p,
  originalPrice: Math.round(p.price * 1.3),
  discount: 23
}))
