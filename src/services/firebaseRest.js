const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY
const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID

const AUTH_BASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts'
const FIRESTORE_BASE_URL = PROJECT_ID
  ? `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`
  : ''

export function isFirebaseConfigured() {
  return Boolean(API_KEY && PROJECT_ID)
}

function requireFirebaseConfig() {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Faltan variables de entorno de Firebase. Configurá VITE_FIREBASE_API_KEY y VITE_FIREBASE_PROJECT_ID.'
    )
  }
}

async function authRequest(action, payload) {
  if (!API_KEY) {
    throw new Error('Falta VITE_FIREBASE_API_KEY en el archivo .env')
  }

  const response = await fetch(`${AUTH_BASE_URL}:${action}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, returnSecureToken: true })
  })

  const data = await response.json()

  if (!response.ok) {
    const message = data?.error?.message || 'No se pudo completar la autenticación.'
    throw new Error(formatFirebaseAuthError(message))
  }

  return {
    email: data.email,
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    localId: data.localId
  }
}

function formatFirebaseAuthError(message) {
  const messages = {
    EMAIL_EXISTS: 'Ese email ya está registrado.',
    EMAIL_NOT_FOUND: 'No existe un usuario con ese email.',
    INVALID_PASSWORD: 'La contraseña no es correcta.',
    INVALID_LOGIN_CREDENTIALS: 'Credenciales inválidas.',
    WEAK_PASSWORD: 'La contraseña debe tener al menos 6 caracteres.',
    USER_DISABLED: 'El usuario fue deshabilitado.'
  }

  return messages[message] || message
}

export function registerWithEmail(email, password) {
  return authRequest('signUp', { email, password })
}

export function loginWithEmail(email, password) {
  return authRequest('signInWithPassword', { email, password })
}

function authHeaders(idToken) {
  const headers = { 'Content-Type': 'application/json' }

  if (idToken) {
    headers.Authorization = `Bearer ${idToken}`
  }

  return headers
}

function toFirestoreValue(value) {
  if (typeof value === 'boolean') return { booleanValue: value }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { integerValue: value } : { doubleValue: value }
  }

  return { stringValue: String(value ?? '') }
}

function fromFirestoreValue(value = {}) {
  if ('stringValue' in value) return value.stringValue
  if ('integerValue' in value) return Number(value.integerValue)
  if ('doubleValue' in value) return Number(value.doubleValue)
  if ('booleanValue' in value) return Boolean(value.booleanValue)
  return ''
}

function fieldsFromObject(object) {
  return {
    fields: Object.entries(object).reduce((acc, [key, value]) => {
      acc[key] = toFirestoreValue(value)
      return acc
    }, {})
  }
}

function productToFirestore(product) {
  const cleanProduct = {
    titulo: product.titulo?.trim() || '',
    precio: Number(product.precio),
    stock: Number(product.stock),
    genero: product.genero?.trim() || '',
    autor: product.autor?.trim() || '',
    imagen: product.imagen?.trim() || '/images/manga-1.jpg',
    sinopsis: product.sinopsis?.trim() || '',
    destacado: Boolean(product.destacado)
  }

  return fieldsFromObject(cleanProduct)
}

function documentToProduct(document) {
  const fields = document.fields || {}
  const docId = document.name?.split('/').pop()

  return {
    id: docId,
    titulo: fromFirestoreValue(fields.titulo),
    precio: fromFirestoreValue(fields.precio),
    stock: fromFirestoreValue(fields.stock),
    genero: fromFirestoreValue(fields.genero),
    autor: fromFirestoreValue(fields.autor),
    imagen: fromFirestoreValue(fields.imagen),
    sinopsis: fromFirestoreValue(fields.sinopsis),
    destacado: fromFirestoreValue(fields.destacado)
  }
}

function couponToFirestore(coupon) {
  const cleanCoupon = {
    code: coupon.code?.trim().toUpperCase() || '',
    percentage: Number(coupon.percentage),
    minPurchase: Number(coupon.minPurchase || 0),
    expirationDate: coupon.expirationDate?.trim() || '',
    active: Boolean(coupon.active)
  }

  return fieldsFromObject(cleanCoupon)
}

function documentToCoupon(document) {
  const fields = document.fields || {}
  const docId = document.name?.split('/').pop()

  return {
    id: docId,
    code: fromFirestoreValue(fields.code),
    percentage: fromFirestoreValue(fields.percentage),
    minPurchase: fromFirestoreValue(fields.minPurchase),
    expirationDate: fromFirestoreValue(fields.expirationDate),
    active: fromFirestoreValue(fields.active)
  }
}

export async function getProducts({ idToken } = {}) {
  requireFirebaseConfig()

  const response = await fetch(`${FIRESTORE_BASE_URL}/products?key=${API_KEY}`, {
    headers: authHeaders(idToken)
  })

  const data = await response.json()

  if (!response.ok) {
    const message = data?.error?.message || 'No se pudo obtener el catálogo desde Firestore.'
    throw new Error(message)
  }

  return (data.documents || []).map(documentToProduct)
}

export async function getProductById(productId, { idToken } = {}) {
  requireFirebaseConfig()

  const response = await fetch(`${FIRESTORE_BASE_URL}/products/${productId}?key=${API_KEY}`, {
    headers: authHeaders(idToken)
  })

  const data = await response.json()

  if (!response.ok) {
    const message = data?.error?.message || 'No se pudo obtener el producto desde Firestore.'
    throw new Error(message)
  }

  return documentToProduct(data)
}

export async function createProduct(product, idToken) {
  requireFirebaseConfig()

  const response = await fetch(`${FIRESTORE_BASE_URL}/products?key=${API_KEY}`, {
    method: 'POST',
    headers: authHeaders(idToken),
    body: JSON.stringify(productToFirestore(product))
  })

  const data = await response.json()

  if (!response.ok) {
    const message = data?.error?.message || 'No se pudo crear el producto.'
    throw new Error(message)
  }

  return documentToProduct(data)
}

export async function updateProduct(productId, product, idToken) {
  requireFirebaseConfig()

  const fieldPaths = ['titulo', 'precio', 'stock', 'genero', 'autor', 'imagen', 'sinopsis', 'destacado']
    .map((field) => `updateMask.fieldPaths=${field}`)
    .join('&')

  const response = await fetch(
    `${FIRESTORE_BASE_URL}/products/${productId}?key=${API_KEY}&${fieldPaths}`,
    {
      method: 'PATCH',
      headers: authHeaders(idToken),
      body: JSON.stringify(productToFirestore(product))
    }
  )

  const data = await response.json()

  if (!response.ok) {
    const message = data?.error?.message || 'No se pudo actualizar el producto.'
    throw new Error(message)
  }

  return documentToProduct(data)
}

export async function deleteProduct(productId, idToken) {
  requireFirebaseConfig()

  const response = await fetch(`${FIRESTORE_BASE_URL}/products/${productId}?key=${API_KEY}`, {
    method: 'DELETE',
    headers: authHeaders(idToken)
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    const message = data?.error?.message || 'No se pudo eliminar el producto.'
    throw new Error(message)
  }

  return true
}

export async function getCoupons({ idToken } = {}) {
  requireFirebaseConfig()

  const response = await fetch(`${FIRESTORE_BASE_URL}/coupons?key=${API_KEY}`, {
    headers: authHeaders(idToken)
  })

  const data = await response.json()

  if (!response.ok) {
    const message = data?.error?.message || 'No se pudieron obtener los cupones.'
    throw new Error(message)
  }

  return (data.documents || []).map(documentToCoupon)
}

export async function getCouponByCode(code) {
  const normalizedCode = code.trim().toUpperCase()
  const coupons = await getCoupons()
  return coupons.find((coupon) => coupon.code === normalizedCode) || null
}

export async function createCoupon(coupon, idToken) {
  requireFirebaseConfig()

  const response = await fetch(`${FIRESTORE_BASE_URL}/coupons?key=${API_KEY}`, {
    method: 'POST',
    headers: authHeaders(idToken),
    body: JSON.stringify(couponToFirestore(coupon))
  })

  const data = await response.json()

  if (!response.ok) {
    const message = data?.error?.message || 'No se pudo crear el cupón.'
    throw new Error(message)
  }

  return documentToCoupon(data)
}

export async function updateCoupon(couponId, coupon, idToken) {
  requireFirebaseConfig()

  const fieldPaths = ['code', 'percentage', 'minPurchase', 'expirationDate', 'active']
    .map((field) => `updateMask.fieldPaths=${field}`)
    .join('&')

  const response = await fetch(
    `${FIRESTORE_BASE_URL}/coupons/${couponId}?key=${API_KEY}&${fieldPaths}`,
    {
      method: 'PATCH',
      headers: authHeaders(idToken),
      body: JSON.stringify(couponToFirestore(coupon))
    }
  )

  const data = await response.json()

  if (!response.ok) {
    const message = data?.error?.message || 'No se pudo actualizar el cupón.'
    throw new Error(message)
  }

  return documentToCoupon(data)
}

export async function deleteCoupon(couponId, idToken) {
  requireFirebaseConfig()

  const response = await fetch(`${FIRESTORE_BASE_URL}/coupons/${couponId}?key=${API_KEY}`, {
    method: 'DELETE',
    headers: authHeaders(idToken)
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    const message = data?.error?.message || 'No se pudo eliminar el cupón.'
    throw new Error(message)
  }

  return true
}
