import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faBookOpen, faUserGear, faRightToBracket, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import CartWidget from '../CartWidget/CartWidget'
import { useAuth } from '../../context/AuthContext'

function NavBar() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <nav className="site-nav">
      <Link to="/">
        <FontAwesomeIcon icon={faHouse} /> Inicio
      </Link>

      <Link to="/productos">
        <FontAwesomeIcon icon={faBookOpen} /> Catálogo
      </Link>

      {isAuthenticated && (
        <Link to="/admin/productos">
          <FontAwesomeIcon icon={faUserGear} /> Admin
        </Link>
      )}

      {isAuthenticated ? (
        <button className="nav-button" type="button" onClick={logout}>
          <FontAwesomeIcon icon={faRightFromBracket} /> Salir
        </button>
      ) : (
        <Link to="/login">
          <FontAwesomeIcon icon={faRightToBracket} /> Login
        </Link>
      )}

      <CartWidget />
    </nav>
  )
}

export default NavBar
