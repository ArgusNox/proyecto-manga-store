import { useEffect, useState } from 'react'
import Item from '../components/Item/Item'
import { getProducts, isFirebaseConfigured } from '../services/firebaseRest'

async function getLocalProducts() {
  const response = await fetch('/data/productos.json')

  if (!response.ok) {
    throw new Error('No se pudo cargar el catálogo local de mangas.')
  }

  return response.json()
}

function Productos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [sourceMessage, setSourceMessage] = useState(null)

  useEffect(() => {
    const obtenerProductos = async () => {
      setCargando(true)
      setError(null)

      try {
        if (isFirebaseConfigured()) {
          const firebaseProducts = await getProducts()

          if (firebaseProducts.length > 0) {
            setProductos(firebaseProducts)
            setSourceMessage('Catálogo cargado desde Firebase Firestore.')
            return
          }
        }

        const localProducts = await getLocalProducts()
        setProductos(localProducts)
        setSourceMessage('Catálogo de respaldo cargado desde JSON local.')
      } catch (error) {
        try {
          const localProducts = await getLocalProducts()
          setProductos(localProducts)
          setSourceMessage('Firestore no respondió. Se muestra el catálogo local de respaldo.')
        } catch {
          setError(error.message)
        }
      } finally {
        setCargando(false)
      }
    }

    obtenerProductos()
  }, [])

  if (cargando) {
    return (
      <section className="page-section">
        <h2>Catálogo de mangas</h2>
        <p className="estado-carga">Cargando catálogo...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="page-section">
        <h2>Catálogo de mangas</h2>
        <p className="form-message form-message--error">Error: {error}</p>
      </section>
    )
  }

  return (
    <section className="page-section">
      <div className="catalog-header">
        <h2>Catálogo de mangas</h2>
        <p>
          Explorá tomos de shonen, seinen, shojo y mucho más en nuestra selección.
        </p>
        {sourceMessage && <span className="data-source">{sourceMessage}</span>}
      </div>

      <div className="catalog-grid">
        {productos.map((producto) => (
          <Item
            key={producto.id}
            id={producto.id}
            titulo={producto.titulo}
            precio={producto.precio}
            genero={producto.genero}
            imagen={producto.imagen}
            autor={producto.autor}
          />
        ))}
      </div>
    </section>
  )
}

export default Productos
