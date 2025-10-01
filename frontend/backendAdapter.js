// backendAdapter.js

// Lista de backends en orden de prioridad
const BACKENDS = [
  {
    nombre: "Python",
    get: "http://localhost:5000/",
    put: "http://localhost:5000/actualizarProductos",
    prioridad: 1
  },
  {
    nombre: "Node.js",
    get: "http://localhost:3000/",
    put: "http://localhost:3000/actualizarProductos",
    prioridad: 2
  },
  {
    nombre: "PHP",
    get: "http://localhost/Portfolio/reactnode/index.php",
    put: "http://localhost/Portfolio/reactnode/index.php",
    prioridad: 3
  }
  // Podés sumar más acá si querés (ej: Python, Java, etc.)
];

// Función que prueba cada backend hasta que uno responda
async function tryFetch(type, options = {}) {
  const backendsOrdenados = [...BACKENDS].sort((a, b) => a.prioridad - b.prioridad);

  for (let backend of backendsOrdenados)
  {
    try
    {
      const url = type === "put" ? backend.put : backend.get;
      const resp = await fetch(url, options);

      if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);

      const data = await resp.json();
      return { backend: backend.nombre, data };
    }
    catch (e)
    {
      console.warn(`❌ Fallo en ${backend.nombre}:`, e.message);
    }
  }
  throw new Error("Ningún backend disponible");
}

// Adapter con funciones comunes
export const backend = {
  async getProductos() {
    return tryFetch("get");
  },
  async actualizarProductos(productosVendidos) {
    return tryFetch("put", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productosVendidos }),
    });
  },
};
