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

function ProductoDetalle() {
  const { id } = useParams()
  const { addToCart } = useCart()

  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const respuesta = await fetch('/data/productos.json')

        if (!respuesta.ok) {
          throw new Error('No se pudo cargar el detalle del manga.')
        }

        const datos = await respuesta.json()

        const productoEncontrado = datos.find(
          (item) => item.id === Number(id)
        )

        if (!productoEncontrado) {
          throw new Error('No se encontró el manga solicitado.')
        }

        setProducto(productoEncontrado)
      } catch (error) {
        setError(error.message)
      } finally {
        setCargando(false)
      }
    }

    obtenerProducto()
  }, [id])

  if (cargando) {
    return (
      <section className="page-section">
        <h2>Detalle del manga</h2>
        <p>Cargando ficha del manga...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="page-section">
        <h2>Detalle del manga</h2>
        <p>Error: {error}</p>
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

          <div className="detail-buy-box">
            <p className="detail-price">${producto.precio}</p>

<button
  className="detail-button"
  onClick={() => addToCart(producto)}
>
  Agregar al carrito
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