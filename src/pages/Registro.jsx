import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Registro() {
  const { register, authLoading, authError } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', clave: '', repetirClave: '' })
  const [localError, setLocalError] = useState(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLocalError(null)

    if (!form.email.trim() || !form.clave.trim()) {
      setLocalError('Completá email y clave para crear la cuenta.')
      return
    }

    if (form.clave.length < 6) {
      setLocalError('La clave debe tener al menos 6 caracteres.')
      return
    }

    if (form.clave !== form.repetirClave) {
      setLocalError('Las claves no coinciden.')
      return
    }

    try {
      await register(form.email, form.clave)
      navigate('/admin/productos', { replace: true })
    } catch {
      // AuthContext muestra el mensaje.
    }
  }

  return (
    <section className="page-section auth-page">
      <div className="auth-card">
        <h2>Crear usuario</h2>
        <p>Registrá un usuario para probar el panel privado de administración.</p>

        {(localError || authError) && (
          <p className="form-message form-message--error">{localError || authError}</p>
        )}

        <form className="admin-form" onSubmit={handleSubmit}>
          <label htmlFor="registro-email">Email</label>
          <input
            id="registro-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />

          <label htmlFor="registro-clave">Clave</label>
          <input
            id="registro-clave"
            type="password"
            name="clave"
            value={form.clave}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
          />

          <label htmlFor="registro-repetir-clave">Repetir clave</label>
          <input
            id="registro-repetir-clave"
            type="password"
            name="repetirClave"
            value={form.repetirClave}
            onChange={handleChange}
            placeholder="Repetí la clave"
          />

          <button className="detail-button" type="submit" disabled={authLoading}>
            {authLoading ? 'Creando usuario...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tenés usuario? <Link to="/login">Ingresar</Link>
        </p>
      </div>
    </section>
  )
}

export default Registro
