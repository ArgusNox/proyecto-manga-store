import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '../../context/CartContext'

function CartWidget() {
  const { cartCount } = useCart()

  return (
    <Link to="/carrito" className="cart-widget">
      <FontAwesomeIcon icon={faCartShopping} />
      <span>Carrito</span>

      {cartCount > 0 && (
        <span className="cart-badge">{cartCount}</span>
      )}
    </Link>
  )
}

export default CartWidget