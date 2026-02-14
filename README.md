📊 Lab Reportes: Next.js Dashboard (PostgreSQL + Docker)
Este proyecto es una aplicación web construida con Next.js 15 que visualiza reportes analíticos consumiendo VIEWS complejas en una base de datos PostgreSQL 15. La solución está completamente empaquetada mediante Docker Compose para asegurar su reproducibilidad.

🚀 Instrucciones de Ejecución
Para levantar el entorno completo (Base de Datos + Aplicación), ejecute el siguiente comando en la raíz del proyecto:

Bash
docker compose up --build
La aplicación estará disponible en http://localhost:3000.

🛠️ Arquitectura de Datos (SQL)
Se diseñaron 5 vistas analíticas que cumplen con los requisitos de funciones agregadas, agrupaciones y lógica condicional:


Rendimiento por Categoría: Utiliza SUM, COUNT y GROUP BY para categorizar la rentabilidad.


Ranking de Clientes: Implementa una Window Function (RANK()) para clasificar la lealtad de los usuarios.


Stock Crítico: Utiliza la cláusula HAVING para filtrar productos con inventario bajo o ventas atípicas.


Análisis de Estatus: Aplica CASE y COALESCE para gestionar estados de órdenes y valores nulos.


Resumen Ejecutivo: Hace uso de CTE (WITH) para comparar el gasto individual contra el promedio global de ventas.

🛡️ Seguridad y Roles
Siguiendo el principio de menor privilegio, se configuró un modelo de seguridad robusto en db/06_roles.sql:


Acceso Restringido: La aplicación se conecta mediante el rol app_report_user, el cual no posee permisos sobre las tablas base.


Solo Lectura: El usuario de la app tiene permiso SELECT exclusivamente sobre las vistas (VIEWS).


Aislamiento: Se evita el uso del superusuario postgres para las operaciones del frontend.

⚡ Optimización con Índices (Justificación)
Se crearon 3 índices estratégicos para optimizar las consultas de las vistas, reduciendo el costo computacional de los JOINS y filtros:


idx_productos_categoria_id: Optimiza la búsqueda de productos por categoría. Al usar EXPLAIN, se observa que el planificador cambia un Sequential Scan por un Index Scan, reduciendo el costo de ejecución significativamente.


idx_ordenes_usuario_id: Acelera los reportes de lealtad y el resumen ejecutivo al agilizar el JOIN entre usuarios y órdenes.


idx_ordenes_status_total: Un índice compuesto que permite realizar un Index Only Scan en el reporte de análisis de estatus, evitando leer el heap de la tabla.

💻 Frontend (Next.js)

Validación de Datos: Se implementó Zod para validar todos los parámetros de entrada (limit, offset) en los reportes.


Paginación Server-Side: Los reportes soportan paginación mediante parámetros en la URL para manejar grandes volúmenes de datos de forma eficiente.


Seguridad en Consultas: Se utilizan queries parametrizadas ($1, $2) para prevenir cualquier intento de inyección SQL.

# Lab Reportes: Dashboards Analíticos

## ⚖️ Trade-offs (Arquitectura)
* **SQL (Cálculos Analíticos)**: Se implementó el 100% de la lógica de agregación, ratios y rankings en las VIEWS de PostgreSQL. Esto permite que el motor de la base de datos optimice las consultas y reduce la carga computacional en el servidor de aplicación.
* **Next.js (Servidor)**: Se utiliza para la validación de parámetros de entrada con Zod y la generación dinámica de la UI, asegurando que el cliente nunca reciba más datos de los necesarios mediante paginación server-side.

## 🛡️ Threat Model (Seguridad)
* **SQL Injection**: Se previno mediante el uso estricto de consultas parametrizadas (`$1, $2, $3`).
* **Privilegios Mínimos**: Se configuró el rol `app_report_user` con acceso exclusivo a `SELECT` sobre las vistas, bloqueando cualquier acceso directo a las tablas base para proteger la integridad de los datos.
* **Validación de Parámetros**: Se implementó una whitelist de parámetros y validación de tipos con `Zod` para evitar la manipulación de consultas.

## 📈 Performance Evidence (EXPLAIN ANALYZE)
### Reporte: Stock Crítico
**Evidencia**:
`Index Scan using idx_productos_cat_lookup on productos (cost=0.15..8.20 rows=10 width=32)`
**Explicación**: El planificador utiliza el índice creado sobre `categoria_id`, lo que permite filtrar los productos con bajo stock de forma eficiente sin realizar un escaneo completo de la tabla.

## 📋 Evidencia de DB
Salida del comando `\dv`:
```text
             List of relations
 Schema |           Name           | Type |  Owner   
--------+--------------------------+------+----------
 public | view_analisis_estatus    | view | postgres
 public | view_rendimiento_categorias | view | postgres
 public | view_resumen_ejecutivo   | view | postgres
 public | view_stock_critico       | view | postgres
 public | view_top_clientes        | view | postgres
(5 rows)

