import * as sellerModel from '../models/sellerModel.js'
import * as productModel from '../models/productModel.js'
import * as orderModel from '../models/orderModel.js'

export function sellerTest(req, res) {
  res.json({ ok: true, message: 'Seller API is up' })
}

export async function getProfile(req, res) {
  try {
    const sellerId = Number(req.params.sellerId)
    if (req.auth.id !== sellerId) return res.status(403).json({ error: 'Forbidden' })
    const seller = await sellerModel.findSellerById(sellerId)
    if (!seller) return res.status(404).json({ error: 'Not found' })
    res.json({
      id: seller.id,
      shopName: seller.shop_name,
      ownerName: seller.owner_name,
      email: seller.email,
      name: seller.owner_name
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function updateProfile(req, res) {
  try {
    const sellerId = Number(req.params.sellerId)
    if (req.auth.id !== sellerId) return res.status(403).json({ error: 'Forbidden' })
    const { shopName, ownerName } = req.body
    await sellerModel.updateSeller(sellerId, { shopName, ownerName })
    const seller = await sellerModel.findSellerById(sellerId)
    res.json({
      id: seller.id,
      shopName: seller.shop_name,
      ownerName: seller.owner_name,
      email: seller.email,
      name: seller.owner_name
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function listProducts(req, res) {
  try {
    const sellerId = Number(req.params.sellerId)
    if (req.auth.id !== sellerId) return res.status(403).json({ error: 'Forbidden' })
    const products = await productModel.listProductsBySeller(sellerId)
    res.json(products.map(shapeSellerProduct))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
}

function shapeSellerProduct(p) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    description: p.description,
    image: p.image,
    image_urls: p.image_urls,
    createdAt: p.created_at
  }
}

export async function createProduct(req, res) {
  try {
    const sellerId = Number(req.params.sellerId)
    if (req.auth.id !== sellerId) return res.status(403).json({ error: 'Forbidden' })
    const { name, category, price, description, imageUrls, imageUrl } = req.body
    if (!name || price == null || !category) {
      return res.status(400).json({ error: 'name, category, price required' })
    }
    const urls = imageUrls?.length ? imageUrls : imageUrl ? [imageUrl] : []
    const id = await productModel.createProduct({
      sellerId,
      name,
      category,
      price: Number(price),
      description: description || '',
      imageUrls: urls
    })
    const p = await productModel.getProductById(id)
    res.json(shapeSellerProduct(p))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function updateProduct(req, res) {
  try {
    const sellerId = Number(req.params.sellerId)
    const productId = Number(req.params.productId)
    if (req.auth.id !== sellerId) return res.status(403).json({ error: 'Forbidden' })
    const { name, category, price, description, imageUrls, imageUrl } = req.body
    let urls = imageUrls
    if (urls == null && imageUrl != null) urls = [imageUrl]
    const ok = await productModel.updateProduct(productId, sellerId, {
      name,
      category,
      price: price != null ? Number(price) : undefined,
      description,
      imageUrls: urls
    })
    if (!ok) return res.status(404).json({ error: 'Product not found' })
    const p = await productModel.getProductById(productId)
    res.json(shapeSellerProduct(p))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function deleteProduct(req, res) {
  try {
    const sellerId = Number(req.params.sellerId)
    const productId = Number(req.params.productId)
    if (req.auth.id !== sellerId) return res.status(403).json({ error: 'Forbidden' })
    const ok = await productModel.deleteProduct(productId, sellerId)
    if (!ok) return res.status(404).json({ error: 'Product not found' })
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function listOrders(req, res) {
  try {
    const sellerId = Number(req.params.sellerId)
    if (req.auth.id !== sellerId) return res.status(403).json({ error: 'Forbidden' })
    const orders = await orderModel.listOrdersForSeller(sellerId)
    res.json(orders)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function updateOrder(req, res) {
  try {
    const sellerId = Number(req.params.sellerId)
    const orderId = Number(req.params.orderId)
    if (req.auth.id !== sellerId) return res.status(403).json({ error: 'Forbidden' })
    const { status } = req.body
    if (!status) return res.status(400).json({ error: 'status required' })
    const ok = await orderModel.updateOrderStatus(orderId, sellerId, status)
    if (!ok) return res.status(404).json({ error: 'Order not found' })
    res.json({ ok: true, id: orderId, status })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
}
