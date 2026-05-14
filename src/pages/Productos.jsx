import { useEffect, useState } from 'react'
import Item from '../components/Item/Item'

function Productos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch('/data/productos.json')

        if (!respuesta.ok) {
          throw new Error('No se pudo cargar el catálogo de mangas.')
        }

        const datos = await respuesta.json()
        setProductos(datos)
      } catch (error) {
        setError(error.message)
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
        <p>Cargando catálogo...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="page-section">
        <h2>Catálogo de mangas</h2>
        <p>Error: {error}</p>
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