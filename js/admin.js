// js/admin.js
import { requireAuth } from './auth.js'
import {
  loadProducts,
  renderProductAdmin,
  saveProduct
} from './products.js'
import { loadOrders } from './orders.js'
import { STATE } from './state.js'

export async function initAdmin() {

  // 🔐 proteção: só admin
  const ok = requireAuth(['admin'])
  if (!ok) return

  // 📦 carrega dados
  await loadProducts()
  await loadOrders()

  // 🧾 renderiza
  renderProductAdmin()
  renderAdminStats()

  // 🎛️ eventos
  bindAdminEvents()
}

/* ==========================
   STATS
========================== */

function renderAdminStats() {
  const el = document.getElementById('adminStats')
  if (!el) return

  const totalOrders = STATE.orders.length
  const totalRevenue = STATE.orders.reduce((s, o) => {
    return s + o.items.reduce(
      (t, i) => t + i.product.price * i.qty, 0
    )
  }, 0)

  el.innerHTML = `
    <div class="card">Pedidos: <strong>${totalOrders}</strong></div>
    <div class="card">Faturamento: <strong>R$ ${totalRevenue.toFixed(2)}</strong></div>
  `
}

/* ==========================
   EVENTS
========================== */

function bindAdminEvents() {

  // salvar produto
  document.addEventListener('click', async e => {
    if (e.target.id === 'saveProduct') {
      const name = document.getElementById('productName').value
      const price = document.getElementById('productPrice').value

      if (!name || !price) {
        alert('Nome e preço obrigatórios')
        return
      }

      await saveProduct({ name, price })
      await loadProducts()
      renderProductAdmin()
    }
  })

}
