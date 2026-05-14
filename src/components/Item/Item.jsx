import { Link } from 'react-router-dom'
import './item.css'

function Item({ id, titulo, precio, genero, imagen, autor }) {
  return (
    <article className="manga-card">
      <img src={imagen} alt={titulo} className="manga-card__image" />

      <div className="manga-card__content">
        <span className="manga-card__genre">{genero}</span>
        <h3>{titulo}</h3>
        <p className="manga-card__author">{autor}</p>
        <p className="manga-card__price">${precio}</p>

        <Link to={`/producto/${id}`} className="manga-card__button">
          Ver detalle
        </Link>
      </div>
    </article>
  )
}

export default Item