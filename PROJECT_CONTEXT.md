# Bazario Project Context

This is an e-commerce project built using Vite + React.

## Buyer Interface
- Fully completed and working
- Must NOT be modified
- Includes:
  - Login
  - Home
  - Product details
  - Cart
  - Wishlist
  - Orders
- Uses Context API + localStorage currently
- UI uses:
  - Color: #FF4800
  - Font: Lato

## Seller Interface
- Basic seller UI implemented
- Includes:
  - Seller login
  - Dashboard
  - Product management
  - Orders page
  - Profile
- Uses Context API + localStorage currently
- Logo: Use the exact same logo as buyer interface (`dist/logo.png`)
- UI uses:
  - Color: #FF4800
  - Font: Lato

## Current Status
- Buyer side: COMPLETE
- Seller side: BASIC implemented
- Data is currently stored in localStorage (mock)

## Task
- Build **backend and MySQL database integration** for both buyer and seller
- Replace all localStorage usage in BuyerContext & SellerContext with API calls
- Keep all frontend exactly the same (UI, routes, colors, fonts, layout, functionality)
- Fallback to mock data if database is empty for testing

## Backend Requirements
- Technology:
  - Node.js + Express
  - MySQL database
  - ORM: Sequelize or Prisma
  - JWT authentication for buyers and sellers
  - CORS configured for frontend communication

- Database Schema:

  ### Buyers
  - id (PK), name, email, password, interests (JSON/text), created_at, updated_at
  - Cart and Wishlist: separate tables or JSON fields
  - Orders linked via `order_items` table

  ### Sellers
  - id (PK), shop_name, owner_name, email, password, created_at, updated_at
  - Products linked via seller_id
  - Orders linked via `order_items` table

  ### Products
  - id (PK), seller_id (FK → sellers.id), name, category, price, description, image_urls (JSON/text), created_at, updated_at

  ### Orders
  - id (PK), buyer_id (FK → buyers.id), seller_id (FK → sellers.id), total_price, status, created_at, updated_at

  ### Order Items
  - id (PK), order_id (FK → orders.id), product_id (FK → products.id), quantity, price

## API Requirements
- Buyer APIs:
  - Profile: GET /buyer/:id, PUT /buyer/:id
  - Cart: GET /cart/:buyerId, POST /cart/:buyerId, PUT /cart/:buyerId, DELETE /cart/:buyerId/:productId
  - Wishlist: GET /wishlist/:buyerId, POST /wishlist/:buyerId, DELETE /wishlist/:buyerId/:productId
  - Orders: GET /orders/:buyerId, POST /orders/:buyerId

- Seller APIs:
  - Profile: GET /seller/:id, PUT /seller/:id
  - Products: GET /seller/:id/products, POST /seller/:id/products, PUT /seller/:id/products/:productId, DELETE /seller/:id/products/:productId
  - Orders: GET /seller/:id/orders, PUT /seller/:id/orders/:orderId

## Authentication
- JWT tokens for login
- Protect routes:
  - Buyers cannot access seller routes
  - Sellers cannot access buyer routes
- Existing login forms remain unchanged but now connect to backend

## Important Rules
- DO NOT modify any existing frontend or UI
- Keep the same design system (#FF4800, Lato, cards/shadows, hover states)
- Only add backend, MySQL database, and API integration
- Ensure frontend still works with all existing routes exactly the same