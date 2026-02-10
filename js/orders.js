// js/orders.js
import { MOCK_API } from './mock.js'
import { STATE } from './state.js'
import { CONFIG } from './config.js'

/* ==========================
   DATA
========================== */

export async function checkout() {
  try {
    const order = await MOCK_API.createOrder()
    alert('Pedido realizado com sucesso!')
    return order
  } catch (err) {
    alert(err.message || 'Erro ao criar pedido')
  }
}

export async function loadOrders() {
  const orders = await MOCK_API.getOrders()
  STATE.orders = orders
  return orders
}

export async function updateOrderStatus(orderId, status) {
  return await MOCK_API.updateOrderStatus(orderId, status)
}

/* ==========================
   UI — CLIENTE
========================== */

export function renderClientOrders(containerId = 'clientOrders') {
  const el = document.getElementById(containerId)
  if (!el) return

  if (!STATE.orders.length) {
    el.innerHTML = '<p>Nenhum pedido ainda</p>'
    return
  }

  el.innerHTML = STATE.orders.map(o => `
    <div class="card">
      <strong>Pedido #${o.id}</strong>
      <div>Status: ${o.status}</div>
      <ul>
        ${o.items.map(i => `
          <li>${i.qty}x ${i.product.name}</li>
        `).join('')}
      </ul>
    </div>
  `).join('')
}

/* ==========================
   UI — COZINHA
========================== */

export function renderKitchenOrders(containerId = 'kitchenOrders') {
  const el = document.getElementById(containerId)
  if (!el) return

  const activeOrders = STATE.orders.filter(
    o => o.status !== CONFIG.ORDER_STATUS.DONE
  )

  if (!activeOrders.length) {
    el.innerHTML = '<p>Nenhum pedido ativo</p>'
    return
  }

  el.innerHTML = activeOrders.map(o => `
    <div class="card kitchen-order">
      <strong>Pedido #${o.id}</strong>

      <ul>
        ${o.items.map(i => `
          <li>${i.qty}x ${i.product.name}</li>
        `).join('')}
      </ul>

      <div class="kitchen-actions">
        ${renderKitchenButtons(o)}
      </div>
    </div>
  `).join('')
}

function renderKitchenButtons(order) {
  switch (order.status) {
    case CONFIG.ORDER_STATUS.PENDING:
      return `<button data-action="prepare" data-id="${order.id}">
                Preparar
              </button>`
    case CONFIG.ORDER_STATUS.PREPARING:
      return `<button data-action="ready" data-id="${order.id}">
                Pronto
              </button>`
    case CONFIG.ORDER_STATUS.READY:
      return `<button data-action="done" data-id="${order.id}">
                Entregue
              </button>`
    default:
      return ''
  }
}

/* ==========================
   EVENTS
========================== */

export function bindOrderEvents() {
  document.addEventListener('click', async e => {

    const action = e.target.dataset.action
    const id = Number(e.target.dataset.id)
    if (!action || !id) return

    let status

    if (action === 'prepare') status = CONFIG.ORDER_STATUS.PREPARING
    if (action === 'ready')   status = CONFIG.ORDER_STATUS.READY
    if (action === 'done')    status = CONFIG.ORDER_STATUS.DONE

    if (!status) return

    await updateOrderStatus(id, status)
    await loadOrders()
    renderKitchenOrders()
  })
}
