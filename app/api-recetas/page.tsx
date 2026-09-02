'use client'

import { useState, useEffect } from 'react'

interface RecetaExterna {
  idMeal: string
  strMeal: string
  strCategory: string
  strArea: string
  strMealThumb: string
}

export default function ApiRecetasPage() {
  const [recetas, setRecetas] = useState<RecetaExterna[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')

  // Cargar recetas aleatorias desde la API
  useEffect(() => {
    const cargarRecetasAPI = async () => {
      try {
        setCargando(true)
        setError('')

        // Pedimos recetas aleatorias a la API pública
        const respuestas = await Promise.all([
          fetch('https://www.themealdb.com/api/json/v1/1/random.php'),
          fetch('https://www.themealdb.com/api/json/v1/1/random.php'),
          fetch('https://www.themealdb.com/api/json/v1/1/random.php'),
          fetch('https://www.themealdb.com/api/json/v1/1/random.php'),
          fetch('https://www.themealdb.com/api/json/v1/1/random.php'),
        ])

        const datos = await Promise.all(respuestas.map(r => r.json()))
        const recetasObtenidas = datos.map(d => d.meals?.[0]).filter(Boolean)
        
        setRecetas(recetasObtenidas)
      } catch (err) {
        setError('❌ No se pudieron cargar las recetas. Intenta de nuevo.')
        console.error(err)
      } finally {
        setCargando(false)
      }
    }

    cargarRecetasAPI()
  }, [])

  // Buscar receta por nombre
  const buscarPorNombre = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!busqueda.trim()) return

    try {
      setCargando(true)
      setError('')
      
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${busqueda}`)
      const datos = await res.json()
      
      if (datos.meals) {
        setRecetas(datos.meals)
      } else {
        setRecetas([])
        setError(`No se encontraron recetas con: "${busqueda}"`)
      }
    } catch (err) {
      setError('❌ Error al buscar.')
    } finally {
      setCargando(false)
    }
  }

  if (cargando) return <div className="container mx-auto p-6">🔄 Cargando recetas desde internet...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">🌐 Recetas desde Internet (API Externa)</h1>

      {/* Buscador de API */}
      <form onSubmit={buscarPorNombre} className="mb-8 flex gap-3">
        <input
          type="text"
          placeholder="Buscar receta en internet..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 md:w-2/3 p-3 border-2 rounded-lg text-lg"
        />
        <button 
          type="submit"
          className="bg-orange-500 text-white px-6 rounded-lg font-medium hover:bg-orange-600"
        >
          🔍 Buscar
        </button>
      </form>

      {/* Manejo de errores */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-600 mb-6">
          {error}
        </div>
      )}

      {/* Listado de recetas de API */}
      {recetas.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No hay recetas para mostrar.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {recetas.map((receta) => (
            <div key={receta.idMeal} className="border rounded-lg overflow-hidden shadow-md bg-white">
              <img 
                src={receta.strMealThumb} 
                alt={receta.strMeal}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-orange-600 mb-2">{receta.strMeal}</h3>
                <p className="text-sm text-gray-500">
                  📂 {receta.strCategory} • 🌍 {receta.strArea}
                </p>
                <a 
                  href={`https://www.themealdb.com/meal/${receta.idMeal}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-orange-500 font-medium hover:underline"
                >
                  Ver receta completa →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}