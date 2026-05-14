import NavBar from './NavBar'

function Header() {
  return (
    <header className="site-header">
      <div className="brand-block">
        <h1>Fenix Manga Store</h1>
        <p>Mangas, tomos y ediciones para verdaderos lectores</p>
      </div>
      <NavBar />
    </header>
  )
}

export default Header