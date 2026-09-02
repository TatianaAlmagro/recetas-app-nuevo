'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function PaginaLogin() {
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [mensaje, setMensaje] = useState('')
  const router = useRouter()

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    setMensaje('Entrando...')

    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: clave
    })

    if (error) {
      setMensaje('❌ Error: ' + error.message)
    } else {
      setMensaje('✅ ¡Bienvenido!')
      setTimeout(() => router.push('/dashboard'), 1500)
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold text-orange-600 mb-6 text-center">🔐 Iniciar Sesión</h1>
      
      <form onSubmit={entrar} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Correo electrónico</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="tu@correo.com"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Contraseña</label>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Tu contraseña"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded font-semibold hover:bg-orange-600 transition"
        >
          Entrar
        </button>

        {mensaje && <p className="text-center mt-4 text-gray-700">{mensaje}</p>}
      </form>
    </main>
  )
}