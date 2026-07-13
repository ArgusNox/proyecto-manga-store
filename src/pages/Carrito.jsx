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
    couponStillEligible,
    cartTotalBeforeDiscount,
    discountAmount,
    cartTotal
  } = useCart()

  const [couponInput, setCouponInput] = useState('')
  const [couponMessage, setCouponMessage] = useState(null)
  const [couponMessageType, setCouponMessageType] = useState('')
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  const handleCouponSubmit = async (event) => {
    event.preventDefault()
    setApplyingCoupon(true)
    setCouponMessage(null)

    const result = await applyCoupon(couponInput)
    setCouponMessage(result.message)
    setCouponMessageType(result.ok ? 'success' : 'error')

    if (result.ok) {
      setCouponInput('')
    }

    setApplyingCoupon(false)
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    setCouponMessage('Cupón quitado del carrito.')
    setCouponMessageType('success')
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
        <p>Ingresá un código vigente creado desde el panel de administración.</p>

        <form className="coupon-form" onSubmit={handleCouponSubmit}>
          <input
            value={couponInput}
            onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
            placeholder="Ejemplo: FENIX15"
            disabled={applyingCoupon}
          />
          <button className="cart-remove-button" type="submit" disabled={applyingCoupon}>
            {applyingCoupon ? 'Validando...' : 'Aplicar'}
          </button>
        </form>

        {couponMessage && (
          <p className={`form-message form-message--${couponMessageType}`}>
            {couponMessage}
          </p>
        )}

        {coupon && (
          <div className="applied-coupon">
            <div>
              <strong>{coupon.code}</strong> — {coupon.percentage}% de descuento
              {Number(coupon.minPurchase) > 0 && (
                <span> · Compra mínima: ${coupon.minPurchase}</span>
              )}
            </div>
            <button className="link-button" type="button" onClick={handleRemoveCoupon}>
              Quitar cupón
            </button>
          </div>
        )}

        {coupon && !couponStillEligible && (
          <p className="form-message form-message--error">
            El total actual ya no alcanza la compra mínima del cupón. El descuento no se aplicará.
          </p>
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
