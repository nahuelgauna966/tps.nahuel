export function mapearLibro(row) {
  if (!row) return null;
  return {
    id: row.id,
    isbn: row.isbn,
    titulo: row.titulo,
    autor: row.autor,
    ejemplaresTotales: row.ejemplares_totales,
    ejemplaresDisponibles: row.ejemplares_disponibles,
    creadoEn: row.creado_en,
    actualizadoEn: row.actualizado_en,
  };
}

export function mapearSocio(row) {
  if (!row) return null;
  return {
    id: row.id,
    documento: row.documento,
    nombre: row.nombre,
    email: row.email,
    bloqueado: Boolean(row.bloqueado),
    creadoEn: row.creado_en,
    actualizadoEn: row.actualizado_en,
  };
}

export function mapearPrestamo(row) {
  if (!row) return null;
  return {
    id: row.id,
    socioId: row.socio_id,
    socio: row.socio_nombre,
    libroId: row.libro_id,
    libro: row.libro_titulo,
    fechaPrestamo: row.fecha_prestamo,
    fechaDevolucion: row.fecha_devolucion,
    activo: row.fecha_devolucion === null,
    creadoEn: row.creado_en,
  };
}
