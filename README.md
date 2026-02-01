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

✅ Checklist de Requisitos Cumplidos
[x] Mínimo 5 VIEWS descriptivas.

[x] Uso de CTE y Window Functions.

[x] Seguridad mediante Roles (No acceso a tablas).

[x] Validación con Zod y queries parametrizadas.

[x] Despliegue con Docker Compose.