import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as buyerModel from '../models/buyerModel.js'
import * as sellerModel from '../models/sellerModel.js'

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function parseInterests(row) {
  if (!row?.interests) return []
  if (typeof row.interests === 'string') {
    try {
      return JSON.parse(row.interests)
    } catch {
      return []
    }
  }
  return row.interests
}

export async function loginBuyer(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
    const buyer = await buyerModel.findBuyerByEmail(email)
    if (!buyer || !(await bcrypt.compare(password, buyer.password))) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const token = signToken({ id: buyer.id, role: 'buyer', email: buyer.email })
    const interests = parseInterests(buyer)
    res.json({
      token,
      user: { id: buyer.id, name: buyer.name, email: buyer.email, interests }
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function loginSeller(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
    const seller = await sellerModel.findSellerByEmail(email)
    if (!seller || !(await bcrypt.compare(password, seller.password))) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const token = signToken({ id: seller.id, role: 'seller', email: seller.email })
    res.json({
      token,
      seller: {
        id: seller.id,
        shopName: seller.shop_name,
        ownerName: seller.owner_name,
        email: seller.email
      }
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
}
