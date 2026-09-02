'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NuevaRecetaPage() {
  const [titulo, setTitulo] = useState('')
  const [ingredientes, setIngredientes] = useState('')
  const [pasos, setPasos] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [esChef, setEsChef] = useState(false)
  const router = useRouter()

  // Verificar que el usuario sea CHEF
  useEffect(() => {
    const verificarRol = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: perfil } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', user.id)
        .single()

      if (perfil?.rol !== 'chef') {
        setError('⚠️ Solo los Chefs pueden publicar recetas 👨‍🍳')
      } else {
        setEsChef(true)
      }
    }

    verificarRol()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Debes iniciar sesión')
      setCargando(false)
      return
    }

    const { error: dbError } = await supabase.from('recetas').insert([
      { 
        titulo, 
        ingredientes, 
        pasos, 
        autor_id: user.id 
      }
    ])

    if (dbError) {
      setError(dbError.message)
    } else {
      router.push('/recetas')
      router.refresh()
    }
    setCargando(false)
  }

  if (!esChef && !error) {
    return <div className="p-6">Cargando...</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">➕ Publicar Receta Nueva 👨‍🍳</h1>
      
      {error ? (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-600">
          {error}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">📌 Título de la receta</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="w-full border rounded p-2"
              placeholder="Ej: Arroz con pollo"
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
              placeholder="Escribe los ingredientes separados por comas..."
            />
          </div>

          <div>
            <label className="block font-medium mb-1">📝 Pasos de preparación</label>
            <textarea
              value={pasos}
              onChange={(e) => setPasos(e.target.value)}
              required
              rows={5}
              className="w-full border rounded p-2"
              placeholder="Describe paso a paso cómo se prepara..."
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="bg-orange-500 text-white px-6 py-2 rounded font-medium hover:bg-orange-600 disabled:bg-gray-400"
          >
            {cargando ? 'Guardando...' : '✅ Publicar Receta'}
          </button>
        </form>
      )}
    </div>
  )
}