// js/mock.js
import { STATE, syncState } from './state.js'
import { CONFIG } from './config.js'

function delay(ms = 200) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const MOCK_API = {

  // -------------------------
  // AUTH
  // -------------------------
  async login(email, password) {
    await delay()

    // login simples mockado
    const role =
      email.includes('cozinha') ? CONFIG.ROLES.KITCHEN :
      email.includes('admin')   ? CONFIG.ROLES.ADMIN :
      CONFIG.ROLES.CLIENT

    const user = {
      id: Date.now(),
      email,
      role,
      token: 'mock-token-' + Math.random().toString(36).slice(2)
    }

    STATE.user = user
    syncState('user')

    return user
  },

  async logout() {
    await delay()
    STATE.user = null
    syncState('user')
    return true
  },

  // -------------------------
  // PRODUCTS
  // -------------------------
  async getProducts() {
    await delay()
    return STATE.products
  },

  async saveProduct(product) {
    await delay()

    if (!product.id) {
      product.id = Date.now()
      STATE.products.push(product)
    } else {
      const i = STATE.products.findIndex(p => p.id === product.id)
      if (i >= 0) STATE.products[i] = product
    }

    syncState('products')
    return product
  },

  async deleteProduct(id) {
    await delay()
    STATE.products = STATE.products.filter(p => p.id !== id)
    syncState('products')
    return true
  },

  // -------------------------
  // CART
  // -------------------------
  async addToCart(product, qty = 1) {
    await delay()

    const item = STATE.cart.find(i => i.product.id === product.id)
    if (item) {
      item.qty += qty
    } else {
      STATE.cart.push({ product, qty })
    }

    syncState('cart')
    return STATE.cart
  },

  async clearCart() {
    await delay()
    STATE.cart = []
    syncState('cart')
    return true
  },

  // -------------------------
  // ORDERS
  // -------------------------
  async createOrder() {
    await delay()

    if (!STATE.cart.length) {
      throw new Error('Carrinho vazio')
    }

    const order = {
      id: Date.now(),
      items: [...STATE.cart],
      status: CONFIG.ORDER_STATUS.PENDING,
      createdAt: new Date().toISOString()
    }

    STATE.orders.push(order)
    syncState('orders')

    STATE.cart = []
    syncState('cart')

    return order
  },

  async getOrders() {
    await delay()
    return STATE.orders
  },

  async updateOrderStatus(orderId, status) {
    await delay()

    const order = STATE.orders.find(o => o.id === orderId)
    if (!order) throw new Error('Pedido não encontrado')

    order.status = status
    syncState('orders')

    return order
  },

  // -------------------------
  // SETTINGS
  // -------------------------
  async getSettings() {
    await delay()
    return STATE.settings
  },

  async saveSettings(settings) {
    await delay()
    STATE.settings = settings
    syncState('settings')
    return settings
  }

}
