// js/cart.js
import { STATE } from './state.js'
import { MOCK_API } from './mock.js'

/* ==========================
   DATA
========================== */

export async function addToCart(product, qty = 1) {
  await MOCK_API.addToCart(product, qty)
  renderCart()
}

export async function removeFromCart(productId) {
  STATE.cart = STATE.cart.filter(item => item.product.id !== productId)
  renderCart()
}

export async function updateQty(productId, qty) {
  const item = STATE.cart.find(i => i.product.id === productId)
  if (!item) return

  item.qty = Math.max(1, qty)
  renderCart()
}

export async function clearCart() {
  await MOCK_API.clearCart()
  renderCart()
}

/* ==========================
   CALCULOS
========================== */

export function getCartTotal() {
  return STATE.cart.reduce(
    (total, item) => total + item.product.price * item.qty,
    0
  )
}

/* ==========================
   UI
========================== */

export function renderCart(containerId = 'cart') {
  const el = document.getElementById(containerId)
  if (!el) return

  if (!STATE.cart.length) {
    el.innerHTML = '<p>Carrinho vazio</p>'
    return
  }

  el.innerHTML = `
    ${STATE.cart.map(item => `
      <div class="cart-item">
        <span>${item.product.name}</span>
        <input 
          type="number" 
          min="1" 
          value="${item.qty}" 
          data-id="${item.product.id}" 
          class="cart-qty"
        >
        <strong>
          R$ ${(item.product.price * item.qty).toFixed(2)}
        </strong>
        <button 
          class="btn-danger remove-cart" 
          data-id="${item.product.id}">
          X
        </button>
      </div>
    `).join('')}

    <div class="cart-total">
      Total: <strong>R$ ${getCartTotal().toFixed(2)}</strong>
    </div>

    <button id="checkoutBtn" class="btn-primary">
      Finalizar Pedido
    </button>
  `
}

/* ==========================
   EVENTS
========================== */

export function bindCartEvents() {
  document.addEventListener('input', e => {
    if (e.target.classList.contains('cart-qty')) {
      const id = Number(e.target.dataset.id)
      const qty = Number(e.target.value)
      updateQty(id, qty)
    }
  })

  document.addEventListener('click', async e => {

    if (e.target.classList.contains('remove-cart')) {
      const id = Number(e.target.dataset.id)
      removeFromCart(id)
    }

    if (e.target.id === 'checkoutBtn') {
      const { checkout } = await import('./orders.js')
      checkout()
    }

  })
}
