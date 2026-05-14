function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-info">
        <h3>Sobre Fenix Manga Store</h3>
        <p>
          Somos una comiquería especializada en manga, ediciones coleccionables
          y recomendaciones por género.
        </p>
      </div>

      <div className="footer-team">
        <article className="team-card">
          <img src="/images/team-1.jpg" alt="Agustin" />
          <h4>Agustin Brizuela</h4>
          <p>Creador de la web</p>
        </article>

        <article className="team-card">
          <img src="/images/team-2.jpg" alt="Agustin segundo" />
          <h4>Clon de Agustin mal pagado</h4>
          <p>Programador de la web</p>
        </article>

        <article className="team-card">
          <img src="/images/team-3.jpg" alt="Agustin tercero" />
          <h4>Tercer Clon de Agustin</h4>
          <p>Especialista en mangas</p>
        </article>
      </div>
    </footer>
  )
}

export default Footer