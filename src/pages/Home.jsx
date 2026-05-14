import { Link } from 'react-router-dom'

function Home() {
  return (
    <section className="page-section">
      <div className="home-hero">
        <h2>Bienvenido a Fenix Manga Store</h2>
        <p>
          Tu rincón especializado en historias intensas: desde la crudeza del 
          seinen clásico hasta los thrillers psicológicos y el shonen más oscuro.
        </p>

        <div className="home-tags">
          <span>Seinen</span>
          <span>Shonen Oscuro</span>
          <span>Misterio</span>
          <span>Fantasía Oscura</span>
          <span>Drama Psicológico</span>
        </div>

        <Link to="/productos" className="hero-button">
          Explorar catálogo
        </Link>
      </div>
    </section>
  )
}

export default Home