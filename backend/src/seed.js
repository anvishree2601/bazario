import bcrypt from 'bcryptjs'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __d = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__d, '..', '..', '.env') })
dotenv.config({ path: path.join(__d, '..', '.env') })

const hash = bcrypt.hashSync('password123', 10)

const productSeeds = [
  [1, 1, 'Wireless Bluetooth Headphones', 'Electronics', 2499, 'Premium sound quality.', ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400']],
  [2, 2, 'Classic Leather Handbag', 'Fashion', 4599, 'Handcrafted genuine leather.', ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400']],
  [3, 1, 'Smart Watch Pro', 'Electronics', 8999, 'Track fitness and notifications.', ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400']],
  [4, 2, 'Organic Cotton T-Shirt', 'Fashion', 899, 'Soft sustainable cotton.', ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400']],
  [5, 3, 'Designer Coffee Table', 'Home & Garden', 12999, 'Modern minimalist table.', ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400']],
  [6, 4, 'Yoga Mat Premium', 'Sports', 1299, 'Non-slip eco-friendly mat.', ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400']],
  [7, 5, 'Skincare Set - 5 Piece', 'Beauty', 2499, 'Natural ingredients.', ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400']],
  [8, 1, 'Portable Power Bank', 'Electronics', 1799, '20000mAh fast charging.', ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400']]
]

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  })

  await conn.query('SET FOREIGN_KEY_CHECKS = 0')
  await conn.query('TRUNCATE TABLE order_items')
  await conn.query('TRUNCATE TABLE orders')
  await conn.query('TRUNCATE TABLE cart')
  await conn.query('TRUNCATE TABLE wishlist')
  await conn.query('TRUNCATE TABLE products')
  await conn.query('TRUNCATE TABLE buyers')
  await conn.query('TRUNCATE TABLE sellers')
  await conn.query('SET FOREIGN_KEY_CHECKS = 1')

  await conn.query(
    `INSERT INTO sellers (id, shop_name, owner_name, email, password) VALUES
     (1, 'TechHub Store', 'Rahul Sharma', 'seller@bazario.com', ?),
     (2, 'Urban Chic', 'Priya Mehta', 'seller2@bazario.com', ?),
     (3, 'Home Elegance', 'Anita Verma', 'seller3@bazario.com', ?),
     (4, 'FitLife Store', 'Vikram Singh', 'seller4@bazario.com', ?),
     (5, 'Glow Beauty', 'Neha Gupta', 'seller5@bazario.com', ?)`,
    [hash, hash, hash, hash, hash]
  )

  await conn.query(
    `INSERT INTO buyers (name, email, password, interests) VALUES (?, ?, ?, ?)`,
    ['Test Buyer', 'buyer@bazario.com', hash, JSON.stringify(['Electronics', 'Fashion'])]
  )

  for (const [id, sellerId, name, category, price, desc, urls] of productSeeds) {
    await conn.query(
      `INSERT INTO products (id, seller_id, name, category, price, description, image_urls)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, sellerId, name, category, price, desc, JSON.stringify(urls)]
    )
  }

  await conn.end()
  console.log('Seed OK')
  console.log('Buyer login: buyer@bazario.com / password123')
  console.log('Seller login: seller@bazario.com / password123')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
