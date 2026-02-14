import { query } from "@/lib/db";
import { z } from "zod";
import Link from "next/link";
import { getReport } from "@/lib/reports";
  

const QuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(10),
  offset: z.coerce.number().min(0).default(0),
});

const reportMeta: Record<string, { title: string; insight: string }> = {
  "1": { title: "Rendimiento por Categoría", insight: "Identifica qué familias de productos generan el mayor margen de contribución." },
  "2": { title: "Ranking de Clientes", insight: "Clasificación de usuarios basada en su valor de vida (LTV) mediante Window Functions." },
  "3": { title: "Stock Crítico", insight: "Alerta de inventario bajo para productos con alta demanda histórica (uso de HAVING)." },
  "4": { title: "Análisis de Estatus", insight: "Distribución del flujo de caja según el estado de las órdenes (CASE/COALESCE)." },
  "5": { title: "Resumen Ejecutivo", insight: "Comparativa de rendimiento individual frente al promedio global del sistema (CTE)." },
};

export default async function ReportPage({ params, searchParams }: any) {
  const { id } = await params;
  const { limit, offset } = QuerySchema.parse(await searchParams);
  
  const views: Record<string, string> = {
    "1": "view_rendimiento_categorias", "2": "view_top_clientes",
    "3": "view_stock_critico", "4": "view_analisis_estatus", "5": "view_resumen_ejecutivo",
  };

  const viewName = views[id];
  if (!viewName) return <div className="p-10 text-center">Reporte no encontrado</div>;

  const result = await getReport(id, limit, offset);




  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <header className="border-b pb-4">
        <h1 className="text-4xl font-extrabold text-white">{reportMeta[id].title}</h1>
        <p className="text-lg text-blue-300 mt-2">{reportMeta[id].insight}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 font-semibold">KPI: Registros Cargados</p>
          <p className="text-2xl font-bold">{result.rowCount}</p>
        </div>
      </div>

      <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              {result.fields.map(f => <th key={f.name} className="px-6 py-3 text-left text-xs uppercase font-bold">{f.name}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {result.rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                {Object.values(row).map((val: any, j) => <td key={j} className="px-6 py-4 text-sm text-gray-600">{val?.toString() || "—"}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Link href={`/reports/${id}?limit=${limit}&offset=${Math.max(0, offset - limit)}`} className="px-6 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition">Anterior</Link>
        <span className="text-sm font-medium text-white">Página {(offset/limit) + 1}</span>
        <Link href={`/reports/${id}?limit=${limit}&offset=${offset + limit}`} className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition">Siguiente</Link>
      </div>
    </div>
  );
}