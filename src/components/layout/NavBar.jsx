import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faBookOpen } from '@fortawesome/free-solid-svg-icons'
import CartWidget from '../CartWidget/CartWidget'

function NavBar() {
  return (
    <nav className="site-nav">
      <Link to="/">
        <FontAwesomeIcon icon={faHouse} /> Inicio
      </Link>

      <Link to="/productos">
        <FontAwesomeIcon icon={faBookOpen} /> Catálogo
      </Link>

      <CartWidget />
    </nav>
  )
}

export default NavBar