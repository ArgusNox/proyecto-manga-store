import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon
} from '../services/firebaseRest'

const initialForm = {
  code: '',
  percentage: '',
  minPurchase: '0',
  expirationDate: '',
  active: true
}

function AdminCupones() {
  const { currentUser } = useAuth()
  const [coupons, setCoupons] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [couponToDelete, setCouponToDelete] = useState(null)

  const loadCoupons = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getCoupons({ idToken: currentUser?.idToken })
      setCoupons(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCoupons()
  }, [])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateForm = () => {
    const errors = {}
    const normalizedCode = form.code.trim().toUpperCase()
    const percentage = Number(form.percentage)
    const minPurchase = Number(form.minPurchase)
    const duplicatedCode = coupons.some(
      (coupon) => coupon.code === normalizedCode && coupon.id !== editingId
    )

    if (!normalizedCode) errors.code = 'El código es obligatorio.'
    if (!/^[A-Z0-9_-]+$/.test(normalizedCode)) {
      errors.code = 'Usá solo letras, números, guion o guion bajo.'
    }
    if (duplicatedCode) errors.code = 'Ya existe un cupón con ese código.'
    if (percentage <= 0 || percentage > 100) {
      errors.percentage = 'El porcentaje debe estar entre 1 y 100.'
    }
    if (minPurchase < 0) {
      errors.minPurchase = 'La compra mínima no puede ser negativa.'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const resetForm = () => {
    setForm(initialForm)
    setEditingId(null)
    setFormErrors({})
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage(null)
    setError(null)

    if (!validateForm()) return

    setSaving(true)
    const payload = {
      code: form.code.trim().toUpperCase(),
      percentage: Number(form.percentage),
      minPurchase: Number(form.minPurchase || 0),
      expirationDate: form.expirationDate,
      active: form.active
    }

    try {
      if (editingId) {
        await updateCoupon(editingId, payload, currentUser?.idToken)
        setMessage('Cupón actualizado correctamente.')
      } else {
        await createCoupon(payload, currentUser?.idToken)
        setMessage('Cupón creado correctamente.')
      }

      resetForm()
      await loadCoupons()
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (coupon) => {
    setEditingId(coupon.id)
    setMessage(null)
    setError(null)
    setForm({
      code: coupon.code || '',
      percentage: coupon.percentage || '',
      minPurchase: coupon.minPurchase || '0',
      expirationDate: coupon.expirationDate || '',
      active: Boolean(coupon.active)
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const confirmDelete = async () => {
    if (!couponToDelete) return

    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      await deleteCoupon(couponToDelete.id, currentUser?.idToken)
      setMessage('Cupón eliminado correctamente.')
      setCouponToDelete(null)
      await loadCoupons()
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="page-section admin-page">
      <div className="admin-header">
        <div>
          <h2>Gestión de cupones</h2>
          <p>Creá, editá, activá o eliminá códigos de descuento almacenados en Firestore.</p>
        </div>
        <span className="admin-user">Sesión: {currentUser?.email}</span>
      </div>

      {message && <p className="form-message form-message--success">{message}</p>}
      {error && <p className="form-message form-message--error">{error}</p>}

      <form className="admin-form admin-form--grid" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="coupon-code">Código *</label>
          <input
            id="coupon-code"
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="FENIX15"
          />
          {formErrors.code && <small>{formErrors.code}</small>}
        </div>

        <div>
          <label htmlFor="coupon-percentage">Porcentaje de descuento *</label>
          <input
            id="coupon-percentage"
            name="percentage"
            type="number"
            min="1"
            max="100"
            value={form.percentage}
            onChange={handleChange}
            placeholder="15"
          />
          {formErrors.percentage && <small>{formErrors.percentage}</small>}
        </div>

        <div>
          <label htmlFor="coupon-min-purchase">Compra mínima</label>
          <input
            id="coupon-min-purchase"
            name="minPurchase"
            type="number"
            min="0"
            value={form.minPurchase}
            onChange={handleChange}
            placeholder="0"
          />
          {formErrors.minPurchase && <small>{formErrors.minPurchase}</small>}
        </div>

        <div>
          <label htmlFor="coupon-expiration">Fecha de vencimiento</label>
          <input
            id="coupon-expiration"
            name="expirationDate"
            type="date"
            value={form.expirationDate}
            onChange={handleChange}
          />
        </div>

        <label className="checkbox-row admin-form__full">
          <input name="active" type="checkbox" checked={form.active} onChange={handleChange} />
          Cupón activo
        </label>

        <div className="admin-actions admin-form__full">
          <button className="detail-button" type="submit" disabled={saving}>
            {saving ? 'Guardando...' : editingId ? 'Actualizar cupón' : 'Crear cupón'}
          </button>
          {editingId && (
            <button className="cart-remove-button" type="button" onClick={resetForm}>
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <h3>Cupones en Firestore</h3>
      {loading ? (
        <p className="estado-carga">Cargando cupones...</p>
      ) : coupons.length === 0 ? (
        <p>Todavía no hay cupones. Creá el primero desde el formulario.</p>
      ) : (
        <div className="coupon-admin-list">
          {coupons.map((coupon) => (
            <article className="coupon-admin-card" key={coupon.id}>
              <div>
                <div className="coupon-admin-title">
                  <h4>{coupon.code}</h4>
                  <span className={coupon.active ? 'status-badge status-badge--active' : 'status-badge status-badge--inactive'}>
                    {coupon.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <p><strong>Descuento:</strong> {coupon.percentage}%</p>
                <p><strong>Compra mínima:</strong> ${coupon.minPurchase || 0}</p>
                <p><strong>Vencimiento:</strong> {coupon.expirationDate || 'Sin vencimiento'}</p>
              </div>

              <div className="admin-product-actions">
                <button className="cart-remove-button" type="button" onClick={() => handleEdit(coupon)}>
                  Editar
                </button>
                <button className="danger-button" type="button" onClick={() => setCouponToDelete(coupon)}>
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {couponToDelete && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="confirm-modal">
            <h3>Confirmar eliminación</h3>
            <p>
              ¿Seguro que querés eliminar el cupón <strong>{couponToDelete.code}</strong>?
            </p>
            <div className="admin-actions">
              <button className="danger-button" type="button" onClick={confirmDelete} disabled={saving}>
                {saving ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
              <button className="cart-remove-button" type="button" onClick={() => setCouponToDelete(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default AdminCupones
