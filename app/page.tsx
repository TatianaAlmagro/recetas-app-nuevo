async function getRecetas(busqueda: string = "") {
  const url = busqueda
    ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${busqueda}`
    : "https://www.themealdb.com/api/json/v1/1/search.php?s=chicken";

  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al cargar recetas");
  return res.json();
}

export default async function PaginaRecetas() {
  const datos = await getRecetas();
  const recetas = datos.meals || [];

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">📚 Recetas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recetas.length === 0 ? (
          <p className="text-gray-600">No se encontraron recetas.</p>
        ) : (
          recetas.map((receta: any) => (
            <div key={receta.idMeal} className="border rounded-lg overflow-hidden shadow-md bg-white">
              <img
                src={receta.strMealThumb}
                alt={receta.strMeal}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">{receta.strMeal}</h3>
                <p className="text-sm text-gray-500">{receta.strCategory}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}