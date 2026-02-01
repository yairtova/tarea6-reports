// app/page.tsx
export default function Home() {
  const reports = [
    { id: 1, name: "Rendimiento por Categoría", desc: "Análisis de ingresos y stock." },
    { id: 2, name: "Ranking de Clientes", desc: "Top compradores por inversión." },
    { id: 3, name: "Stock Crítico", desc: "Productos que necesitan reabastecimiento." },
    { id: 4, name: "Estatus de Órdenes", desc: "Resumen operativo del flujo de órdenes." },
    { id: 5, name: "Resumen Ejecutivo", desc: "KPIs comparativos contra el promedio." },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((r) => (
        <a key={r.id} href={`/reports/${r.id}`} className="block p-6 bg-white rounded-lg border shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-bold mb-2">Reporte {r.id}: {r.name}</h2>
          <p className="text-gray-600">{r.desc}</p>
        </a>
      ))}
    </div>
  );
}