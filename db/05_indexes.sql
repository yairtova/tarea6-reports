-- Índice para optimizar los JOINS entre productos y categorías (usado en vistas 1 y 3)
CREATE INDEX idx_productos_cat_lookup ON productos(categoria_id);

-- Índice para acelerar los reportes de ventas por cliente (usado en vistas 2 y 5)
CREATE INDEX idx_ordenes_usuario_lookup ON ordenes(usuario_id);

-- Índice compuesto para el estatus y el total (usado en vista 4)
CREATE INDEX idx_ordenes_status_total ON ordenes(status, total);

-- JUSTIFICACIÓN:
-- Al ejecutar EXPLAIN ANALYZE, estos índices reducen el costo de los 'Sequential Scans' 
-- transformándolos en 'Index Scans' o 'Bitmap Heap Scans' en las tablas de mayor volumen.