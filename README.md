#  Bazario  
### Sell Anytime, Buy Anytime  

Bazario is a full-stack dual-login e-commerce web application that connects **buyers and sellers on a single platform**. Buyers can explore and purchase products, while sellers can manage their shop, products, and orders efficiently.

---

##  Features

###  Buyer Interface (Core Features Implemented, Enhancements Ongoing)
- Dual login system (Buyer & Seller)
-  Login & Authentication
-  Interest-based personalization (planned enhancement)
-  Home page with:
  - Banners & sliders (UI ready, dynamic integration in progress)
  - Limited-time offers (UI ready, dynamic integration in progress)
  - Personalized recommendations (planned enhancement)
-  Product search with filters
-  Product Details:
  - Images, price (₹), description
  - Ratings, reviews, FAQs
  - "More from this Shop"
- Shop pages with follow/message options (under development)
-  Cart & Checkout
- Wishlist / Saved items
- Order History
- Profile & Settings

---

###  Seller Interface (Core Features Implemented, Enhancements Ongoing)
- Dual login system (Buyer & Seller)
-  Seller Login
-  Dashboard (planned enhancement)
-  Product Management (Add/Edit/Delete)
-  Orders Management
-  Seller Profile

---

##  UI/UX Design

- **Primary Color:** `#FF4800`
- **Font:** Lato
- Fully responsive (Desktop, Tablet, Mobile)
- Smooth animations and transitions

---

##  Tech Stack

### Frontend
- React (Vite)
- Context API (State Management)
- CSS (Custom styling)

### Backend
- Node.js
- Express.js

### Database
- MySQL

### ORM
- Sequelize 

### Authentication
- JWT (JSON Web Tokens)

---

##  Project Structure

Bazario
<br>
├── frontend/
│   ├── buyer/
│   ├── seller/
│   └── context/
<br>
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── config/
<br>
└── database/
    └── schema.sql

---

##  Database Schema

### Buyers
- id (PK)
- name
- email (unique)
- password
- interests (JSON)
- created_at
- updated_at

### Sellers
- id (PK)
- shop_name
- owner_name
- email (unique)
- password
- created_at
- updated_at

### Products
- id (PK)
- seller_id (FK → sellers.id)
- name
- category
- price
- description
- image_urls (JSON)
- created_at
- updated_at

### Orders
- id (PK)
- buyer_id (FK → buyers.id)
- seller_id (FK → sellers.id)
- total_price
- status (default: Confirmed)
- created_at
- updated_at

### Order Items
- id (PK)
- order_id (FK → orders.id)
- product_id (FK → products.id)
- quantity
- price

### Cart
- id (PK)
- buyer_id (FK → buyers.id)
- product_id (FK → products.id)
- quantity (default: 1)
- unique constraint (buyer_id, product_id)

### Wishlist
- id (PK)
- buyer_id (FK → buyers.id)
- product_id (FK → products.id)
- unique constraint (buyer_id, product_id)
---

##  API Endpoints

### Buyer APIs
- `GET /buyer/:id`
- `PUT /buyer/:id`
- `GET /cart/:buyerId`
- `POST /cart/:buyerId`
- `PUT /cart/:buyerId`
- `DELETE /cart/:buyerId/:productId`
- `GET /wishlist/:buyerId`
- `POST /wishlist/:buyerId`
- `DELETE /wishlist/:buyerId/:productId`
- `GET /orders/:buyerId`
- `POST /orders/:buyerId`

---

### Seller APIs
- `GET /seller/:id`
- `PUT /seller/:id`
- `GET /seller/:id/products`
- `POST /seller/:id/products`
- `PUT /seller/:id/products/:productId`
- `DELETE /seller/:id/products/:productId`
- `GET /seller/:id/orders`
- `PUT /seller/:id/orders/:orderId`

---

## Authentication

- JWT-based authentication
- Protected routes:
  - Buyers cannot access seller routes
  - Sellers cannot access buyer routes
- Existing login UI connected to backend

---

## Current Status

| Module        | Status         |
|--------------|---------------|
| Buyer UI      |  Enhancements Ongoing |
| Seller UI     |  Enhancements Ongoing |
| Backend       |  In Progress |
| Database      |  Integrated  |
| localStorage  |  Replaced with API-driven state (fallback support enabled) |

---

## Backend Integration Update

- Replacing **localStorage** with **MySQL database**
- Context APIs now use **backend API calls**
- Fallback to mock data if DB is empty (for testing)
<br>
Detailed backend setup and API documentation available in `/backend/README.md`

---

## Future Improvements
- Payment Gateway Integration
- Real-time Order Tracking
- Notifications System
- Advanced Reviews & Ratings
- Seller Analytics Dashboard
- Buyer's Interest-based Personalization
- Personalized Recommendations 


## Author
Anvi Shree

