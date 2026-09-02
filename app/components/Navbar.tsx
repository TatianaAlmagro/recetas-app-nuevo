import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-orange-600 text-white p-4 mb-8">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">🧑‍🍳 RecetasApp</Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-orange-200">Inicio</Link>
          <Link href="/recetas" className="hover:text-orange-200">Recetas</Link>
          <Link href="/login" className="hover:text-orange-200">Iniciar Sesión</Link>
          <Link href="/registro" className="bg-white text-orange-600 px-3 py-1 rounded font-semibold hover:bg-orange-100">Registrarse</Link>
        </div>
      </div>
    </nav>
  )
}