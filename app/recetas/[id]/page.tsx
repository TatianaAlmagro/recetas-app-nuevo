'use client'

import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RecetaDetallePage() {
  const params = useParams()
  const recetaId = params?.id as string
  const [receta, setReceta] = useState<any>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarDetalle = async () => {
      if (!recetaId) return

      const { data, error } = await supabase
        .from('recetas')
        .select('*')
        .eq('id', recetaId)
        .single()

      if (data) {
        setReceta(data)
      }
      setCargando(false)
    }

    cargarDetalle()
  }, [recetaId])

  if (cargando) return <div className="p-6">Cargando receta...</div>
  if (!receta) return <div className="p-6">Receta no encontrada</div>

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">{receta.titulo}</h1>
      
      <div className="space-y-6">
        <div className="bg-orange-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">🥗 Ingredientes</h2>
          <p className="whitespace-pre-wrap text-gray-700">{receta.ingredientes}</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">📝 Pasos de preparación</h2>
          <p className="whitespace-pre-wrap text-gray-700">{receta.pasos}</p>
        </div>
      </div>
    </div>
  )
}