import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookOpen,
  faUser,
  faTag,
  faBoxOpen,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import { useCart } from '../context/CartContext'
import { getProductById, isFirebaseConfigured } from '../services/firebaseRest'

async function getLocalProductById(id) {
  const response = await fetch('/data/productos.json')

  if (!response.ok) {
    throw new Error('No se pudo cargar el detalle local del manga.')
  }

  const data = await response.json()
  const product = data.find((item) => String(item.id) === String(id))

  if (!product) {
    throw new Error('No se encontró el manga solicitado.')
  }

  return product
}

function ProductoDetalle() {
  const { id } = useParams()
  const { addToCart } = useCart()

  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [cartMessage, setCartMessage] = useState(null)

  useEffect(() => {
    const obtenerProducto = async () => {
      setCargando(true)
      setError(null)

      try {
        if (isFirebaseConfigured() && Number.isNaN(Number(id))) {
          const firebaseProduct = await getProductById(id)
          setProducto(firebaseProduct)
          return
        }

        const localProduct = await getLocalProductById(id)
        setProducto(localProduct)
      } catch (error) {
        try {
          const localProduct = await getLocalProductById(id)
          setProducto(localProduct)
        } catch {
          setError(error.message)
        }
      } finally {
        setCargando(false)
      }
    }

    obtenerProducto()
  }, [id])

  const handleAddToCart = () => {
    addToCart(producto)
    setCartMessage(`${producto.titulo} fue agregado al carrito.`)
  }

  if (cargando) {
    return (
      <section className="page-section">
        <h2>Detalle del manga</h2>
        <p className="estado-carga">Cargando ficha del manga...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="page-section">
        <h2>Detalle del manga</h2>
        <p className="form-message form-message--error">Error: {error}</p>
        <Link to="/productos" className="detail-back">
          <FontAwesomeIcon icon={faArrowLeft} /> Volver al catálogo
        </Link>
      </section>
    )
  }

  return (
    <section className="page-section">
      <div className="detail-layout">
        <div className="detail-image-box">
          <img
            src={producto.imagen}
            alt={producto.titulo}
            className="detail-image"
          />
        </div>

        <div className="detail-info">
          <span className="detail-genre">{producto.genero}</span>

          <h2>{producto.titulo}</h2>

          <p className="detail-meta">
            <FontAwesomeIcon icon={faUser} /> <strong>Autor:</strong> {producto.autor}
          </p>

          <p className="detail-meta">
            <FontAwesomeIcon icon={faTag} /> <strong>Género:</strong> {producto.genero}
          </p>

          <p className="detail-meta">
            <FontAwesomeIcon icon={faBoxOpen} /> <strong>Stock:</strong> {producto.stock}
          </p>

          <p className="detail-meta">
            <FontAwesomeIcon icon={faBookOpen} /> <strong>Sinopsis:</strong>
          </p>

          <p className="detail-sinopsis">{producto.sinopsis}</p>

          {cartMessage && <p className="form-message form-message--success">{cartMessage}</p>}

          <div className="detail-buy-box">
            <p className="detail-price">${producto.precio}</p>

            <button
              className="detail-button"
              onClick={handleAddToCart}
              disabled={Number(producto.stock) <= 0}
            >
              {Number(producto.stock) <= 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>
          </div>

          <Link to="/productos" className="detail-back">
            <FontAwesomeIcon icon={faArrowLeft} /> Volver al catálogo
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ProductoDetalle
