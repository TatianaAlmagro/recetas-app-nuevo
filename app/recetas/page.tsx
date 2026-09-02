'use client'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function RecetasPage() {
  const [recetas, setRecetas] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)

  // Cargar todas las recetas
  useEffect(() => {
    const cargarRecetas = async () => {
      const { data, error } = await supabase
        .from('recetas')
        .select('*')
        .order('creado_en', { ascending: false })

      if (data) setRecetas(data)
      setCargando(false)
    }

    cargarRecetas()
  }, [])

  // Filtrar recetas según lo que escribe el usuario
  const recetasFiltradas = recetas.filter(receta =>
    receta.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    receta.ingredientes?.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (cargando) return <div className="p-6">Cargando recetas...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">🍳 Todas las Recetas</h1>

      {/* 🔍 BUSCADOR */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="🔍 Buscar receta por nombre o ingrediente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full md:w-2/3 lg:w-1/2 p-3 border-2 rounded-lg text-lg focus:outline-none focus:border-orange-400"
        />
      </div>
      {/* FIN DEL BUSCADOR */}

      {recetasFiltradas.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">
            {busqueda ? 'No se encontraron recetas con ese nombre.' : 'No hay recetas publicadas todavía.'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {recetasFiltradas.map((receta) => (
            <Link 
              key={receta.id} 
              href={`/recetas/${receta.id}`}
              className="border rounded-lg p-5 hover:shadow-lg transition-shadow bg-white"
            >
              <h2 className="text-xl font-semibold mb-2 text-orange-600">{receta.titulo}</h2>
              <p className="text-gray-600 text-sm mt-2">
                {receta.ingredientes?.substring(0, 80)}...
              </p>
              <span className="inline-block mt-3 text-orange-500 font-medium text-sm">
                Ver receta →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}