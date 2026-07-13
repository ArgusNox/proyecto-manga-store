import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Home from './pages/Home'
import Productos from './pages/Productos'
import ProductoDetalle from './pages/ProductoDetalle'
import Carrito from './pages/Carrito'
import Login from './pages/Login'
import Registro from './pages/Registro'
import AdminProductos from './pages/AdminProductos'
import AdminCupones from './pages/AdminCupones'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route
          path="/admin/productos"
          element={
            <ProtectedRoute>
              <AdminProductos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/cupones"
          element={
            <ProtectedRoute>
              <AdminCupones />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  )
}

export default App
