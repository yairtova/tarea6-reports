-- ============================================
-- 1. Vista de Rendimiento por Categoría
-- Grain: Una fila por categoría
-- Métricas: Total ventas, cantidad de productos, % del total global
-- Por qué: Usa GROUP BY para agrupar productos y CASE para clasificar el éxito.
-- ============================================
CREATE VIEW view_rendimiento_categorias AS
SELECT 
    c.nombre AS categoria,
    COUNT(p.id) AS total_productos,
    COALESCE(SUM(od.subtotal), 0) AS ingresos_totales,
    CASE 
        WHEN SUM(od.subtotal) > 1000 THEN 'Alta Rentabilidad'
        WHEN SUM(od.subtotal) BETWEEN 1 AND 1000 THEN 'Promedio'
        ELSE 'Sin Ventas'
    END AS estatus_comercial
FROM categorias c
LEFT JOIN productos p ON c.id = p.categoria_id
LEFT JOIN orden_detalles od ON p.id = od.producto_id
GROUP BY c.nombre;

-- VERIFY: SELECT * FROM view_rendimiento_categorias;

-- ============================================
-- 2. Top Clientes (Window Function)
-- Grain: Una fila por usuario
-- Métricas: Total gastado, ranking de importancia
-- Por qué: Usa RANK() para determinar la posición del cliente según sus compras.
-- ============================================
CREATE VIEW view_top_clientes AS
SELECT 
    u.nombre AS cliente,
    u.email,
    SUM(o.total) AS inversion_total,
    RANK() OVER (ORDER BY SUM(o.total) DESC) AS ranking_lealtad
FROM usuarios u
JOIN ordenes o ON u.id = o.usuario_id
GROUP BY u.id, u.nombre, u.email;

-- VERIFY: SELECT * FROM view_top_clientes WHERE ranking_lealtad <= 3;

-- ============================================
-- 3. Productos Críticos (HAVING)
-- Grain: Una fila por producto
-- Métricas: Stock actual, ingresos generados
-- Por qué: Usa HAVING para filtrar solo productos con stock bajo (< 10).
-- ============================================
CREATE VIEW view_stock_critico AS
SELECT 
    p.nombre AS producto,
    p.stock,
    c.nombre AS categoria,
    SUM(od.cantidad) AS unidades_vendidas
FROM productos p
JOIN categorias c ON p.categoria_id = c.id
LEFT JOIN orden_detalles od ON p.id = od.producto_id
GROUP BY p.id, p.nombre, p.stock, c.nombre
HAVING p.stock < 10 OR SUM(od.cantidad) > 100;

-- VERIFY: SELECT * FROM view_stock_critico ORDER BY stock ASC;

-- ============================================
-- 4. Análisis de Órdenes por Estatus (CASE/COALESCE)
-- Grain: Una fila por estatus de orden
-- Métricas: Conteo de órdenes, promedio de pago
-- Por qué: Usa COALESCE para evitar nulos y muestra la distribución del flujo.
-- ============================================
CREATE VIEW view_analisis_estatus AS
SELECT 
    status,
    COUNT(*) AS total_ordenes,
    COALESCE(AVG(total), 0) AS promedio_ticket,
    SUM(CASE WHEN status = 'entregado' THEN total ELSE 0 END) AS ingresos_liquidados
FROM ordenes
GROUP BY status
HAVING COUNT(*) > 0;

-- VERIFY: SELECT * FROM view_analisis_estatus;

-- ============================================
-- 5. Resumen Ejecutivo de Ventas (CTE)
-- Grain: Resumen general por usuario con métricas calculadas
-- Métricas: Total ventas vs Promedio General
-- Por qué: Usa un CTE (WITH) para calcular el promedio global antes de comparar.
-- ============================================
CREATE VIEW view_resumen_ejecutivo AS
WITH PromedioGlobal AS (
    SELECT AVG(total) as avg_total FROM ordenes
)
SELECT 
    u.nombre,
    COUNT(o.id) as num_pedidos,
    SUM(o.total) as total_gastado,
    ROUND((SUM(o.total) / (SELECT avg_total FROM PromedioGlobal)) * 100, 2) as ratio_vs_promedio
FROM usuarios u
JOIN ordenes o ON u.id = o.usuario_id
GROUP BY u.id, u.nombre;

-- VERIFY: SELECT * FROM view_resumen_ejecutivo;