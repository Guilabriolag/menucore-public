// js/state.js
import { storageGet, storageSet } from './storage.js'

export const STATE = {
  user: storageGet('user'),

  products: storageGet('products', []),
  categories: storageGet('categories', []),

  cart: storageGet('cart', []),
  orders: storageGet('orders', []),

  settings: storageGet('settings', {
    restaurantName: 'Meu Restaurante',
    allowOrder: true
  })
}

// --- Helpers de sincronização ---

export function syncState(key) {
  if (STATE[key] !== undefined) {
    storageSet(key, STATE[key])
  }
}

export function resetState() {
  STATE.user = null
  STATE.cart = []
  syncState('user')
  syncState('cart')
}
