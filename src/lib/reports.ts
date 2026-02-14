import { query } from "./db";

const reportQueries: Record<string, string> = {
  "1": "SELECT * FROM view_rendimiento_categorias LIMIT $1 OFFSET $2",
  "2": "SELECT * FROM view_top_clientes LIMIT $1 OFFSET $2",
  "3": "SELECT * FROM view_stock_critico LIMIT $1 OFFSET $2",
  "4": "SELECT * FROM view_analisis_estatus LIMIT $1 OFFSET $2",
  "5": "SELECT * FROM view_resumen_ejecutivo LIMIT $1 OFFSET $2",
};

export async function getReport(id: string, limit: number, offset: number) {
  const sql = reportQueries[id];

  if (!sql) {
    throw new Error("Reporte invalido");
  }

  return query(sql, [limit, offset]);
}
