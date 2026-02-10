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

  const ok = requireAuth(['admin'])
  if (!ok) return

  await loadProducts()
  await loadOrders()

  renderProductAdmin()
  renderAdminStats()
  bindAdminEvents()
}

/* ==========================
   STATS
========================== */

function renderAdminStats() {
  const el = document.getElementById('adminStats')
  if (!el) return

  el.innerHTML = `
    <div class="card">Produtos: <strong>${STATE.products.length}</strong></div>
    <div class="card">Pedidos: <strong>${STATE.orders.length}</strong></div>
  `
}

/* ==========================
   EVENTS
========================== */

function bindAdminEvents() {
  document.getElementById('saveProduct')?.addEventListener('click', async () => {

    const nameEl = document.getElementById('productName')
    const priceEl = document.getElementById('productPrice')

    if (!nameEl || !priceEl) {
      alert('Campos não encontrados')
      return
    }

    const name = nameEl.value.trim()
    const price = Number(priceEl.value)

    if (!name || price <= 0) {
      alert('Nome ou preço inválido')
      return
    }

    await saveProduct({ name, price })
    await loadProducts()
    renderProductAdmin()

    nameEl.value = ''
    priceEl.value = ''
  })
}
