import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  createProduct,
  deleteProduct,
  getProducts,
  isFirebaseConfigured,
  updateProduct
} from '../services/firebaseRest'

const initialForm = {
  titulo: '',
  precio: '',
  stock: '',
  genero: '',
  autor: '',
  imagen: '/images/manga-1.jpg',
  sinopsis: '',
  destacado: false
}

function AdminProductos() {
  const { currentUser } = useAuth()
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [productToDelete, setProductToDelete] = useState(null)

  const loadProducts = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getProducts({ idToken: currentUser?.idToken })
      setProducts(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
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

    if (!form.titulo.trim()) errors.titulo = 'El nombre del manga es obligatorio.'
    if (!form.autor.trim()) errors.autor = 'El autor es obligatorio.'
    if (!form.genero.trim()) errors.genero = 'El género es obligatorio.'
    if (!form.sinopsis.trim()) errors.sinopsis = 'La sinopsis es obligatoria.'
    if (Number(form.precio) <= 0) errors.precio = 'El precio debe ser mayor a 0.'
    if (Number(form.stock) < 0) errors.stock = 'El stock no puede ser negativo.'

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
      ...form,
      precio: Number(form.precio),
      stock: Number(form.stock)
    }

    try {
      if (editingId) {
        await updateProduct(editingId, payload, currentUser?.idToken)
        setMessage('Producto actualizado correctamente.')
      } else {
        await createProduct(payload, currentUser?.idToken)
        setMessage('Producto creado correctamente.')
      }

      resetForm()
      await loadProducts()
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setMessage(null)
    setError(null)
    setForm({
      titulo: product.titulo || '',
      precio: product.precio || '',
      stock: product.stock || '',
      genero: product.genero || '',
      autor: product.autor || '',
      imagen: product.imagen || '/images/manga-1.jpg',
      sinopsis: product.sinopsis || '',
      destacado: Boolean(product.destacado)
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      await deleteProduct(productToDelete.id, currentUser?.idToken)
      setMessage('Producto eliminado correctamente.')
      setProductToDelete(null)
      await loadProducts()
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
          <h2>Administración de productos</h2>
          <p>Gestioná el catálogo de mangas desde Firebase Firestore.</p>
        </div>
        <span className="admin-user">Sesión: {currentUser?.email}</span>
      </div>

      {!isFirebaseConfigured() && (
        <p className="form-message form-message--error">
          Faltan variables de Firebase. Configurá VITE_FIREBASE_API_KEY y VITE_FIREBASE_PROJECT_ID.
        </p>
      )}

      {message && <p className="form-message form-message--success">{message}</p>}
      {error && <p className="form-message form-message--error">{error}</p>}

      <form className="admin-form admin-form--grid" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="titulo">Nombre del manga *</label>
          <input id="titulo" name="titulo" value={form.titulo} onChange={handleChange} />
          {formErrors.titulo && <small>{formErrors.titulo}</small>}
        </div>

        <div>
          <label htmlFor="autor">Autor *</label>
          <input id="autor" name="autor" value={form.autor} onChange={handleChange} />
          {formErrors.autor && <small>{formErrors.autor}</small>}
        </div>

        <div>
          <label htmlFor="genero">Género *</label>
          <input id="genero" name="genero" value={form.genero} onChange={handleChange} />
          {formErrors.genero && <small>{formErrors.genero}</small>}
        </div>

        <div>
          <label htmlFor="precio">Precio *</label>
          <input id="precio" name="precio" type="number" value={form.precio} onChange={handleChange} />
          {formErrors.precio && <small>{formErrors.precio}</small>}
        </div>

        <div>
          <label htmlFor="stock">Stock *</label>
          <input id="stock" name="stock" type="number" value={form.stock} onChange={handleChange} />
          {formErrors.stock && <small>{formErrors.stock}</small>}
        </div>

        <div>
          <label htmlFor="imagen">URL de imagen</label>
          <input id="imagen" name="imagen" value={form.imagen} onChange={handleChange} />
        </div>

        <div className="admin-form__full">
          <label htmlFor="sinopsis">Sinopsis *</label>
          <textarea id="sinopsis" name="sinopsis" value={form.sinopsis} onChange={handleChange} rows="4" />
          {formErrors.sinopsis && <small>{formErrors.sinopsis}</small>}
        </div>

        <label className="checkbox-row admin-form__full">
          <input name="destacado" type="checkbox" checked={form.destacado} onChange={handleChange} />
          Marcar como destacado
        </label>

        <div className="admin-actions admin-form__full">
          <button className="detail-button" type="submit" disabled={saving}>
            {saving ? 'Guardando...' : editingId ? 'Actualizar producto' : 'Crear producto'}
          </button>
          {editingId && (
            <button className="cart-remove-button" type="button" onClick={resetForm}>
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <h3>Productos en Firestore</h3>
      {loading ? (
        <p className="estado-carga">Cargando productos...</p>
      ) : products.length === 0 ? (
        <p>Todavía no hay productos en Firestore. Creá el primero desde el formulario.</p>
      ) : (
        <div className="admin-product-list">
          {products.map((product) => (
            <article className="admin-product-card" key={product.id}>
              <img src={product.imagen} alt={product.titulo} />
              <div>
                <h4>{product.titulo}</h4>
                <p>{product.autor} · {product.genero}</p>
                <p>${product.precio} · Stock: {product.stock}</p>
              </div>
              <div className="admin-product-actions">
                <button className="cart-remove-button" type="button" onClick={() => handleEdit(product)}>
                  Editar
                </button>
                <button className="danger-button" type="button" onClick={() => setProductToDelete(product)}>
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {productToDelete && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="confirm-modal">
            <h3>Confirmar eliminación</h3>
            <p>
              ¿Seguro que querés eliminar <strong>{productToDelete.titulo}</strong> del catálogo?
            </p>
            <div className="admin-actions">
              <button className="danger-button" type="button" onClick={confirmDelete} disabled={saving}>
                {saving ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
              <button className="cart-remove-button" type="button" onClick={() => setProductToDelete(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default AdminProductos
