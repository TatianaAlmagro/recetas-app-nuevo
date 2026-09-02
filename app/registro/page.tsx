'use client'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function RecetasPage() {
  const [recetas, setRecetas] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarRecetas = async () => {
      const { data, error } = await supabase
        .from('recetas')
        .select('*, autor:autor_id(nombre)')
        .order('creado_en', { ascending: false })

      if (data) setRecetas(data)
      setCargando(false)
    }

    cargarRecetas()
  }, [])

  if (cargando) return <div className="p-6">Cargando recetas...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">🍳 Todas las Recetas</h1>
      
      {recetas.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No hay recetas publicadas todavía.</p>
          <p className="text-gray-400 mt-2">¡Sé el primero en publicar una receta!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {recetas.map((receta) => (
            <Link 
              key={receta.id} 
              href={`/recetas/${receta.id}`}
              className="border rounded-lg p-5 hover:shadow-lg transition-shadow bg-white"
            >
              <h2 className="text-xl font-semibold mb-2 text-orange-600">{receta.titulo}</h2>
              <p className="text-sm text-gray-500 mb-3">
                👨‍🍳 Por: {receta.autor?.nombre || 'Desconocido'}
              </p>
              <p className="text-gray-600 text-sm line-clamp-2">
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