// js/products.js
import { MOCK_API } from './mock.js'
import { STATE } from './state.js'
import { CONFIG } from './config.js'

/* ==========================
   DATA
========================== */

export async function loadProducts() {
  const products = await MOCK_API.getProducts()
  STATE.products = products
  return products
}

export async function saveProduct(data) {
  const product = {
    id: data.id || null,
    name: data.name,
    price: Number(data.price),
    category: data.category || 'Geral',
    active: data.active !== false
  }

  return await MOCK_API.saveProduct(product)
}

export async function deleteProduct(id) {
  return await MOCK_API.deleteProduct(id)
}

/* ==========================
   UI — TOTEM / CLIENTE
========================== */

export function renderProducts(containerId = 'productGrid') {
  const el = document.getElementById(containerId)
  if (!el) return

  el.innerHTML = STATE.products
    .filter(p => p.active)
    .map(p => `
      <div class="card product" data-id="${p.id}">
        <strong>${p.name}</strong>
        <span>R$ ${p.price.toFixed(2)}</span>
        <button class="btn-primary add-cart" data-id="${p.id}">
          Adicionar
        </button>
      </div>
    `)
    .join('')
}

/* ==========================
   UI — ADMIN
========================== */

export function renderProductAdmin(containerId = 'adminProducts') {
  const el = document.getElementById(containerId)
  if (!el) return

  el.innerHTML = STATE.products.map(p => `
    <div class="card">
      <input type="text" value="${p.name}" data-field="name" data-id="${p.id}">
      <input type="number" value="${p.price}" data-field="price" data-id="${p.id}">
      <button class="btn-danger delete-product" data-id="${p.id}">
        Excluir
      </button>
    </div>
  `).join('')
}

/* ==========================
   EVENTS
========================== */

export function bindProductEvents() {
  document.addEventListener('click', async e => {

    // adicionar ao carrinho
    if (e.target.classList.contains('add-cart')) {
      const id = Number(e.target.dataset.id)
      const product = STATE.products.find(p => p.id === id)
      if (product) {
        const { addToCart } = await import('./cart.js')
        addToCart(product)
      }
    }

    // excluir produto (admin)
    if (e.target.classList.contains('delete-product')) {
      const id = Number(e.target.dataset.id)
      await deleteProduct(id)
      await loadProducts()
      renderProductAdmin()
    }
  })
}
