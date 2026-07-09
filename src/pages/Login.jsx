import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { login, authLoading, authError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/admin/productos'
  const [form, setForm] = useState({ email: '', clave: '' })
  const [localError, setLocalError] = useState(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLocalError(null)

    if (!form.email.trim() || !form.clave.trim()) {
      setLocalError('Completá los datos para ingresar.')
      return
    }

    try {
      await login(form.email, form.clave)
      navigate(redirectTo, { replace: true })
    } catch {
      // AuthContext muestra el mensaje.
    }
  }

  return (
    <section className="page-section auth-page">
      <div className="auth-card">
        <h2>Ingresar a administración</h2>
        <p>Accedé para crear, editar y eliminar mangas del catálogo.</p>

        {(localError || authError) && (
          <p className="form-message form-message--error">{localError || authError}</p>
        )}

        <form className="admin-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />

          <label htmlFor="login-clave">Clave</label>
          <input
            id="login-clave"
            type="password"
            name="clave"
            value={form.clave}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
          />

          <button className="detail-button" type="submit" disabled={authLoading}>
            {authLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="auth-switch">
          ¿No tenés usuario? <Link to="/registro">Crear cuenta</Link>
        </p>
      </div>
    </section>
  )
}

export default Login
