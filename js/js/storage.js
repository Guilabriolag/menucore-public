// js/storage.js
import { CONFIG } from './config.js'

function key(name) {
  return CONFIG.STORAGE_PREFIX + name
}

export function storageGet(name, fallback = null) {
  try {
    const data = localStorage.getItem(key(name))
    return data ? JSON.parse(data) : fallback
  } catch (e) {
    console.error('Storage GET error:', name, e)
    return fallback
  }
}

export function storageSet(name, value) {
  try {
    localStorage.setItem(key(name), JSON.stringify(value))
    return true
  } catch (e) {
    console.error('Storage SET error:', name, e)
    return false
  }
}

export function storageRemove(name) {
  localStorage.removeItem(key(name))
}

export function storageClearAll() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(CONFIG.STORAGE_PREFIX))
    .forEach(k => localStorage.removeItem(k))
}
