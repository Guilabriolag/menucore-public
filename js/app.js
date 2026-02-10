// js/app.js
import { loadProducts, renderProducts, bindProductEvents } from './products.js'
import { bindCartEvents, renderCart } from './cart.js'
import { loadOrders } from './orders.js'
import { isAuthenticated } from './auth.js'

document.addEventListener('DOMContentLoaded', async () => {

  const page = document.body.dataset.page

  // 📦 dados básicos
  await loadProducts()

  // 🛒 carrinho (cliente)
  if (page === 'totem') {
    renderProducts()
    renderCart()
    bindProductEvents()
    bindCartEvents()
  }

  // 📊 painel admin
  if (page === 'admin') {
    const { initAdmin } = await import('./admin.js')
    initAdmin()
  }

  // 🍳 cozinha
  if (page === 'kitchen') {
    const { initKitchen } = await import('./kitchen.js')
    initKitchen()
  }

})
