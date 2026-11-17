# TP 5 – API de biblioteca con MVC

API REST desarrollada con Node.js, Express y SQLite para administrar libros, socios y préstamos. El código separa rutas, controladores, servicios, dominio y acceso a datos.

## Requisitos

- Node.js 22 o superior
- npm (se incluye con Node.js)

## Instalación y ejecución

Desde la carpeta `tp-5/`:

```bash
npm install
npm run seed
npm start
```

La API queda disponible en `http://localhost:3000`. La base de datos se crea automáticamente en `storage/biblioteca.sqlite` al iniciar; el esquema está en `database/migrations/001_initial_schema.sql`. `npm run seed` agrega datos de ejemplo sin duplicarlos.

Para usar otro puerto o archivo SQLite:

```bash
PORT=4000 DATABASE_PATH=./storage/prueba.sqlite npm start
```

## Estructura MVC

```text
src/
├── controllers/   # Traduce solicitudes HTTP a operaciones y respuestas
├── dao/           # Acceso a SQLite y consultas SQL
├── domain/        # Entidades, validaciones y errores de dominio
├── routes/        # Rutas HTTP de libros, socios y préstamos
├── services/      # Reglas de negocio y coordinación transaccional
├── app.js         # Configura Express y conecta las capas
├── index.js       # Inicia el servidor
└── seed.js        # Carga datos de ejemplo

database/migrations/ # Esquema y relaciones SQL
test/                # Pruebas automáticas de la API
```

## Recursos y endpoints

### Libros

| Método | Ruta | Acción |
|---|---|---|
| GET | `/libros` | Listar libros |
| GET | `/libros/:id` | Obtener un libro |
| POST | `/libros` | Crear un libro |
| PUT | `/libros/:id` | Actualizar datos (acepta campos parciales) |
| DELETE | `/libros/:id` | Eliminar si nunca tuvo préstamos |

Campos para crear: `isbn`, `titulo`, `autor`, `ejemplaresTotales`.

### Socios

| Método | Ruta | Acción |
|---|---|---|
| GET | `/socios` | Listar socios |
| GET | `/socios/:id` | Obtener un socio |
| POST | `/socios` | Crear un socio |
| PUT | `/socios/:id` | Actualizar datos (acepta campos parciales) |
| DELETE | `/socios/:id` | Eliminar si nunca tuvo préstamos |

Campos para crear: `documento`, `nombre`; `email` es opcional y `bloqueado` es opcional (por defecto `false`). Para bloquear/desbloquear, actualizar `bloqueado` con `true` o `false`.

### Préstamos

| Método | Ruta | Acción |
|---|---|---|
| GET | `/prestamos` | Listar historial |
| GET | `/prestamos/:id` | Obtener un préstamo |
| POST | `/prestamos` | Registrar un préstamo |
| POST | `/prestamos/:id/devolucion` | Registrar su devolución (fecha actual) |

Para crear un préstamo enviar `socioId` y `libroId`. Opcionalmente se puede especificar `fechaPrestamo` en formato `YYYY-MM-DD`.

## Reglas de negocio implementadas

1. Un socio no puede tener más de tres préstamos activos; una devolución libera un lugar.
2. No se presta un libro si `ejemplaresDisponibles` es cero.
3. Un socio con `bloqueado: true` no puede pedir préstamos.
4. Registrar un préstamo inserta el historial y descuenta una unidad disponible dentro de una transacción.
5. Devolver un préstamo activo registra la fecha y aumenta el stock dentro de una transacción.
6. No se permite devolver dos veces el mismo préstamo ni usar una fecha de devolución anterior a la del préstamo.
7. Los identificadores ISBN, documento y email (si existe) son únicos.
8. No se eliminan libros ni socios con historial de préstamos, para conservar la integridad referencial.
9. Al reducir el total de ejemplares, el nuevo total no puede quedar por debajo de los préstamos activos.

Los errores usan JSON con `{ "error": { "codigo": "...", "mensaje": "..." } }`. Los estados HTTP principales son `201` para creación, `400` para validación, `404` para recurso inexistente y `409` para conflictos de negocio o duplicados.

## Pruebas automáticas

```bash
npm test
```

Las pruebas usan una base SQLite en memoria y comprueban CRUD, disponibilidad, límite de préstamos, socios bloqueados, falta de stock, devolución e integridad del historial.

## Ejemplos con curl

Cargar los datos de ejemplo con `npm run seed` y, en otra terminal, iniciar la API con `npm start`.

```bash
# Listar libros
curl http://localhost:3000/libros

# Crear un libro
curl -X POST http://localhost:3000/libros \
  -H 'Content-Type: application/json' \
  -d '{"isbn":"978-0000000001","titulo":"Rayuela","autor":"Julio Cortázar","ejemplaresTotales":3}'

# Crear un socio
curl -X POST http://localhost:3000/socios \
  -H 'Content-Type: application/json' \
  -d '{"documento":"33444555","nombre":"Lucía Fernández","email":"lucia@example.com"}'

# Registrar un préstamo (usar IDs existentes de /libros y /socios)
curl -X POST http://localhost:3000/prestamos \
  -H 'Content-Type: application/json' \
  -d '{"socioId":1,"libroId":1}'

# Ver el historial
curl http://localhost:3000/prestamos

# Devolver el préstamo con ID 1
curl -X POST http://localhost:3000/prestamos/1/devolucion
```
