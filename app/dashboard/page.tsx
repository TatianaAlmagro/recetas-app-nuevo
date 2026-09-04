'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface Receta {
  id: string;
  titulo: string;
  ingredientes: string;
  instrucciones: string;
}

export default function DashboardPage() {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    verificarSesion();
    cargarRecetas();
  }, []);

  const verificarSesion = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/registro');
    }
  };

  const cargarRecetas = async () => {
    try {
      const { data, error } = await supabase
        .from('recetas')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data) {
        setRecetas(data);
      }
    } catch (err) {
      console.log('Cargando recetas...');
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push('/registro');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333' }}>📚 Mis Recetas</h1>
        <button
          onClick={cerrarSesion}
          style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Cerrar sesión
        </button>
      </div>

      <p style={{ color: '#666', marginBottom: '20px' }}>Bienvenido/a! Bienvenida a tu colección de recetas.</p>

      {cargando ? (
        <p>Cargando recetas...</p>
      ) : recetas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9fafb', borderRadius: '10px' }}>
          <h3>¡Aún no tienes recetas!</h3>
          <p>Agrega tu primera receta desde el formulario.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {recetas.map((receta) => (
            <div key={receta.id} style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#fff' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>{receta.titulo}</h3>
              <p><strong>Ingredientes:</strong> {receta.ingredientes}</p>
              <p><strong>Instrucciones:</strong> {receta.instrucciones}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}