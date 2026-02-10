// js/kitchen.js
import { requireAuth } from './auth.js'
import { loadOrders, renderKitchenOrders, bindOrderEvents } from './orders.js'

export async function initKitchen() {

  // 🔐 proteção: só cozinha ou admin
  const ok = requireAuth(['kitchen', 'admin'])
  if (!ok) return

  // 🔄 carrega pedidos
  await loadOrders()

  // 🍳 renderiza tela da cozinha
  renderKitchenOrders()

  // 🎛️ eventos (botões de status)
  bindOrderEvents()

  // 🔁 auto refresh simples
  setInterval(async () => {
    await loadOrders()
    renderKitchenOrders()
  }, 5000)
}
