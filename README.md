# Base de datos — Taller API de Personajes Marvel

Este repositorio **solo** contiene la base de datos PostgreSQL con datos de prueba.
El proyecto NestJS lo deben crear ustedes desde cero, en una carpeta aparte.

## Requisitos
- Docker Desktop (o Docker Engine + Docker Compose)

## Levantar la base de datos
```bash
docker compose up -d
```
La primera vez se crean las tablas `teams` y `characters` y se cargan los datos iniciales.

## Datos de conexión
| Dato       | Valor       |
|------------|-------------|
| Host       | localhost   |
| Puerto     | 5433        |
| Usuario    | marvel      |
| Contraseña | marvel123   |
| Base       | marvel_db   |

(Se usa el puerto 5433 para no chocar con un PostgreSQL que ya tengan instalado.)

## Comandos útiles
```bash
docker compose ps          # ver si está corriendo
docker compose logs -f     # ver logs
docker compose down        # apagar (los datos se conservan)
docker compose down -v     # apagar y BORRAR datos (al subir de nuevo se recargan los iniciales)
docker exec -it marvel_db psql -U marvel -d marvel_db   # consola SQL
```
---

# API NestJS

La API está en la carpeta `project/`, organizada en los módulos `characters` y `teams`. Esta API no modificada nada de la BASE de datos.

## Requisitos adicionales
- Node.js 20 o superior

## Cómo correr la API

1. Levantar la base de datos desde la raíz con las instrucciones anteriores
```
2. Instalar dependencias y arrancar la API:
```bash
   cd project
   npm install
   npm run start:dev
```
3. Abrir la documentación en Swagger:
```
   En el navegador del host
   **http://localhost:3000/docs**
```
Para correr las pruebas unitarias:
```bash
npm test
```

