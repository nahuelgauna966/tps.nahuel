PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS libros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    isbn TEXT NOT NULL UNIQUE,
    titulo TEXT NOT NULL,
    autor TEXT NOT NULL,
    ejemplares_totales INTEGER NOT NULL CHECK (ejemplares_totales > 0),
    ejemplares_disponibles INTEGER NOT NULL CHECK (
        ejemplares_disponibles >= 0 AND ejemplares_disponibles <= ejemplares_totales
    ),
    creado_en TEXT NOT NULL DEFAULT (datetime('now')),
    actualizado_en TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS socios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    documento TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE,
    bloqueado INTEGER NOT NULL DEFAULT 0 CHECK (bloqueado IN (0, 1)),
    creado_en TEXT NOT NULL DEFAULT (datetime('now')),
    actualizado_en TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS prestamos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    socio_id INTEGER NOT NULL REFERENCES socios(id) ON DELETE RESTRICT,
    libro_id INTEGER NOT NULL REFERENCES libros(id) ON DELETE RESTRICT,
    fecha_prestamo TEXT NOT NULL,
    fecha_devolucion TEXT,
    creado_en TEXT NOT NULL DEFAULT (datetime('now')),
    CHECK (fecha_devolucion IS NULL OR fecha_devolucion >= fecha_prestamo)
);

CREATE INDEX IF NOT EXISTS idx_prestamos_socio_activos
    ON prestamos(socio_id, fecha_devolucion);
CREATE INDEX IF NOT EXISTS idx_prestamos_libro_activos
    ON prestamos(libro_id, fecha_devolucion);
