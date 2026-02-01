-- ============================================
-- 06_ROLES.SQL - Seguridad Real
-- ============================================

-- 1. Crear el rol (si falla porque ya existe, puedes ignorar el error o borrarlo antes)
-- DROP ROLE IF EXISTS app_report_user;
CREATE ROLE app_report_user WITH LOGIN PASSWORD 'NextReports2026';

-- 2. Permisos básicos de conexión
GRANT CONNECT ON DATABASE report_db TO app_report_user;
GRANT USAGE ON SCHEMA public TO app_report_user;

-- 3. Acceso específico a las VIEWS (Cumpliendo: "solo sobre VIEWS, no sobre tablas")
GRANT SELECT ON view_rendimiento_categorias TO app_report_user;
GRANT SELECT ON view_top_clientes TO app_report_user;
GRANT SELECT ON view_stock_critico TO app_report_user;
GRANT SELECT ON view_analisis_estatus TO app_report_user;
GRANT SELECT ON view_resumen_ejecutivo TO app_report_user;

-- 4. Asegurar que no tenga acceso a futuras tablas por error
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM app_report_user;