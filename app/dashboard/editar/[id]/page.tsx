'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { useParams, useRouter } from 'next/navigation'

export default function EditarRecetaPage() {
  const params = useParams()
  const router = useRouter()
  const recetaId = params?.id as string

  const [titulo, setTitulo] = useState('')
  const [ingredientes, setIngredientes] = useState('')
  const [pasos, setPasos] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [cargandoDatos, setCargandoDatos] = useState(true)

  useEffect(() => {
    const cargarReceta = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('recetas')
        .select('*')
        .eq('id', recetaId)
        .single()

      if (data) {
        if (data.autor_id !== user.id) {
          setError('No tienes permiso para editar esta receta')
        } else {
          setTitulo(data.titulo)
          setIngredientes(data.ingredientes)
          setPasos(data.pasos)
        }
      }
      setCargandoDatos(false)
    }

    cargarReceta()
  }, [recetaId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    setError('')

    const { error: dbError } = await supabase
      .from('recetas')
      .update({ titulo, ingredientes, pasos })
      .eq('id', recetaId)

    if (dbError) {
      setError(dbError.message)
    } else {
      router.push('/recetas')
      router.refresh()
    }
    setCargando(false)
  }

  const handleEliminar = async () => {
    if (!confirm('¿Seguro que quieres eliminar esta receta?')) return
    
    const { error } = await supabase
      .from('recetas')
      .delete()
      .eq('id', recetaId)

    if (error) {
      alert('Error al eliminar: ' + error.message)
    } else {
      router.push('/recetas')
      router.refresh()
    }
  }

  if (cargandoDatos) return <div className="p-6">Cargando...</div>
  if (error && !titulo) return <div className="p-6 text-red-500">{error}</div>

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">✏️ Editar Receta</h1>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">📌 Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">🥗 Ingredientes</label>
          <textarea
            value={ingredientes}
            onChange={(e) => setIngredientes(e.target.value)}
            required
            rows={4}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">📝 Pasos</label>
          <textarea
            value={pasos}
            onChange={(e) => setPasos(e.target.value)}
            required
            rows={5}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={cargando}
            className="bg-blue-500 text-white px-6 py-2 rounded font-medium hover:bg-blue-600"
          >
            💾 {cargando ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          
          <button
            type="button"
            onClick={handleEliminar}
            className="bg-red-500 text-white px-6 py-2 rounded font-medium hover:bg-red-600"
          >
            🗑️ Eliminar Receta
          </button>
        </div>
      </form>
    </div>
  )
}