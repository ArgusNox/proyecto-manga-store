import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Carrito() {
  const { cart, removeFromCart, clearCart, cartTotal } = useCart()

  if (cart.length === 0) {
    return (
      <section className="page-section">
        <h2>Tu carrito</h2>
        <p>No agregaste mangas todavía.</p>
        <Link to="/productos" className="detail-back">
          Ir al catálogo
        </Link>
      </section>
    )
  }

  return (
    <section className="page-section">
      <h2>Tu carrito</h2>

      <div className="cart-list">
        {cart.map((item) => (
          <article key={item.id} className="cart-item">
            <img src={item.imagen} alt={item.titulo} className="cart-item__image" />

            <div className="cart-item__info">
              <h3>{item.titulo}</h3>
              <p><strong>Autor:</strong> {item.autor}</p>
              <p><strong>Género:</strong> {item.genero}</p>
              <p><strong>Cantidad:</strong> {item.quantity}</p>
              <p><strong>Precio unitario:</strong> ${item.precio}</p>
              <p><strong>Subtotal:</strong> ${item.precio * item.quantity}</p>

              <button
                className="cart-remove-button"
                onClick={() => removeFromCart(item.id)}
              >
                Quitar del carrito
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total: ${cartTotal}</h3>

        <button className="detail-button" onClick={clearCart}>
          Vaciar carrito
        </button>
      </div>
    </section>
  )
}

export default Carrito