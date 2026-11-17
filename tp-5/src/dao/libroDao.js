import { mapearLibro } from '../domain/mapeo.js';

export class LibroDao {
  constructor(db) {
    this.db = db;
    this.insertarStmt = db.prepare(`
      INSERT INTO libros (isbn, titulo, autor, ejemplares_totales, ejemplares_disponibles)
      VALUES (@isbn, @titulo, @autor, @ejemplaresTotales, @ejemplaresDisponibles)
    `);
    this.actualizarStmt = db.prepare(`
      UPDATE libros
      SET isbn = @isbn, titulo = @titulo, autor = @autor,
          ejemplares_totales = @ejemplaresTotales,
          ejemplares_disponibles = @ejemplaresDisponibles,
          actualizado_en = datetime('now')
      WHERE id = @id
    `);
  }

  listar() {
    return this.db.prepare('SELECT * FROM libros ORDER BY id').all().map(mapearLibro);
  }

  buscarPorId(id) {
    return mapearLibro(this.db.prepare('SELECT * FROM libros WHERE id = ?').get(id));
  }

  buscarPorIsbn(isbn) {
    return mapearLibro(this.db.prepare('SELECT * FROM libros WHERE isbn = ?').get(isbn));
  }

  crear(libro) {
    const result = this.insertarStmt.run({
      ...libro,
      ejemplaresDisponibles: libro.ejemplaresTotales,
    });
    return this.buscarPorId(Number(result.lastInsertRowid));
  }

  actualizar(id, libro) {
    this.actualizarStmt.run({ id, ...libro });
    return this.buscarPorId(id);
  }

  eliminar(id) {
    return this.db.prepare('DELETE FROM libros WHERE id = ?').run(id).changes > 0;
  }

  contarPrestamosActivos(id) {
    return this.db.prepare(`
      SELECT COUNT(*) AS cantidad FROM prestamos
      WHERE libro_id = ? AND fecha_devolucion IS NULL
    `).get(id).cantidad;
  }

  tieneHistorialPrestamos(id) {
    return this.db.prepare('SELECT 1 FROM prestamos WHERE libro_id = ? LIMIT 1').get(id) !== undefined;
  }

  ajustarDisponibles(id, diferencia) {
    return this.db.prepare(`
      UPDATE libros
      SET ejemplares_disponibles = ejemplares_disponibles + ?, actualizado_en = datetime('now')
      WHERE id = ?
    `).run(diferencia, id).changes > 0;
  }
}
