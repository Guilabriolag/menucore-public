// js/auth.js
import { MOCK_API } from './mock.js'
import { STATE } from './state.js'
import { CONFIG } from './config.js'

export async function login(email, password) {
  const user = await MOCK_API.login(email, password)
  return user
}

export async function logout() {
  await MOCK_API.logout()
  return true
}

export function isAuthenticated() {
  return !!STATE.user
}

export function hasRole(role) {
  return STATE.user && STATE.user.role === role
}

export function requireAuth(allowedRoles = []) {
  if (!STATE.user) {
    window.location.href = 'login.html'
    return false
  }

  if (allowedRoles.length && !allowedRoles.includes(STATE.user.role)) {
    alert('Acesso não autorizado')
    window.location.href = 'index.html'
    return false
  }

  return true
}
