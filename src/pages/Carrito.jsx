import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Carrito() {
  const {
    cart,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    coupon,
    cartTotalBeforeDiscount,
    discountAmount,
    cartTotal
  } = useCart()

  const [couponInput, setCouponInput] = useState('')
  const [couponMessage, setCouponMessage] = useState(null)

  const handleCouponSubmit = (event) => {
    event.preventDefault()

    if (!couponInput.trim()) {
      setCouponMessage('Ingresá un cupón para aplicarlo.')
      return
    }

    const applied = applyCoupon(couponInput)
    setCouponMessage(applied ? 'Cupón aplicado correctamente.' : 'Cupón inválido.')
  }

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

      <div className="coupon-box">
        <h3>Cupón de descuento</h3>
        <form className="coupon-form" onSubmit={handleCouponSubmit}>
          <input
            value={couponInput}
            onChange={(event) => setCouponInput(event.target.value)}
            placeholder="Ingresá tu cupón"
          />
          <button className="cart-remove-button" type="submit">Aplicar</button>
        </form>
        {couponMessage && <p className="form-message">{couponMessage}</p>}
        {coupon && (
          <button className="link-button" type="button" onClick={removeCoupon}>
            Quitar cupón {coupon.code}
          </button>
        )}
      </div>

      <div className="cart-summary">
        <div>
          <p>Subtotal: ${cartTotalBeforeDiscount}</p>
          <p>Descuento: -${discountAmount}</p>
          <h3>Total: ${cartTotal}</h3>
        </div>

        <button className="detail-button" onClick={clearCart}>
          Vaciar carrito
        </button>
      </div>
    </section>
  )
}

export default Carrito
