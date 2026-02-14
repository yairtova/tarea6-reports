import { query } from "@/lib/db";
import { z } from "zod";
import Link from "next/link";

const QuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(10),
  offset: z.coerce.number().min(0).default(0),
  search: z.string().optional(), 
});

const reportMeta: Record<string, { title: string; insight: string; filterCol?: string }> = {
  "1": { title: "Rendimiento por Categoría", insight: "Analiza la rentabilidad por familia de productos para priorizar stock.", filterCol: "categoria" },
  "2": { title: "Ranking de Clientes", insight: "Clasificación de lealtad basada en inversión total (Window Function).", filterCol: "cliente" },
  "3": { title: "Stock Crítico", insight: "Detecta productos con bajo inventario o alta rotación (HAVING)." },
  "4": { title: "Análisis de Estatus", insight: "Distribución financiera según el estado de las órdenes." },
  "5": { title: "Resumen Ejecutivo", insight: "Comparativa de gasto individual vs promedio global (CTE)." },
};

export default async function ReportPage({ params, searchParams }: any) {
  const { id } = await params;
  const { limit, offset, search } = QuerySchema.parse(await searchParams);
  
  const views: Record<string, string> = {
    "1": "view_rendimiento_categorias", "2": "view_top_clientes",
    "3": "view_stock_critico", "4": "view_analisis_estatus", "5": "view_resumen_ejecutivo",
  };

  const viewName = views[id];
  const meta = reportMeta[id];
  if (!viewName || !meta) return <div className="p-10">Reporte no encontrado</div>;

  let sql = `SELECT * FROM ${viewName}`;
  const params_sql: any[] = [limit, offset];
  
  if (search && meta.filterCol) {
    sql += ` WHERE ${meta.filterCol} ILIKE $3`;
    params_sql.push(`%${search}%`);
  }
  sql += ` LIMIT $1 OFFSET $2`;

  const result = await query(sql, params_sql);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">{meta.title}</h1>
        <p className="text-blue-600 font-medium italic">{meta.insight}</p>
      </header>

      {meta.filterCol && (
        <form className="flex gap-2">
          <input name="search" defaultValue={search} placeholder={`Buscar por ${meta.filterCol}...`} className="border p-2 rounded w-64" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Filtrar</button>
        </form>
      )}

      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
        <p className="text-sm text-gray-500 uppercase font-bold">Total Registros en Vista</p>
        <p className="text-2xl font-mono text-blue-700">{result.rowCount}</p>
      </div>

      <div className="overflow-x-auto shadow rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {result.fields.map(f => <th key={f.name} className="px-6 py-3 text-left text-xs font-bold uppercase">{f.name}</th>)}
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {result.rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {Object.values(row).map((val: any, j) => <td key={j} className="px-6 py-4 text-sm text-gray-700">{val?.toString() || "N/A"}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between">
        <Link href={`/reports/${id}?limit=${limit}&offset=${Math.max(0, offset - limit)}`} className="px-4 py-2 border rounded hover:bg-gray-50">Anterior</Link>
        <Link href={`/reports/${id}?limit=${limit}&offset=${offset + limit}`} className="px-4 py-2 border rounded hover:bg-gray-50">Siguiente</Link>
      </div>
    </div>
  );
}