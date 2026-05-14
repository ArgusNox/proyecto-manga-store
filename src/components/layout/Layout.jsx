import Header from './Header'
import Footer from './Footer'
import './layout.css'

function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </>
  )
}

export default Layout