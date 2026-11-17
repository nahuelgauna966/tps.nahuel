import { mapearSocio } from '../domain/mapeo.js';

export class SocioDao {
  constructor(db) {
    this.db = db;
    this.insertarStmt = db.prepare(`
      INSERT INTO socios (documento, nombre, email, bloqueado)
      VALUES (@documento, @nombre, @email, @bloqueado)
    `);
    this.actualizarStmt = db.prepare(`
      UPDATE socios
      SET documento = @documento, nombre = @nombre, email = @email,
          bloqueado = @bloqueado, actualizado_en = datetime('now')
      WHERE id = @id
    `);
  }

  listar() {
    return this.db.prepare('SELECT * FROM socios ORDER BY id').all().map(mapearSocio);
  }

  buscarPorId(id) {
    return mapearSocio(this.db.prepare('SELECT * FROM socios WHERE id = ?').get(id));
  }

  crear(socio) {
    const result = this.insertarStmt.run({
      ...socio,
      bloqueado: socio.bloqueado ? 1 : 0,
    });
    return this.buscarPorId(Number(result.lastInsertRowid));
  }

  actualizar(id, socio) {
    this.actualizarStmt.run({
      id,
      ...socio,
      bloqueado: socio.bloqueado ? 1 : 0,
    });
    return this.buscarPorId(id);
  }

  eliminar(id) {
    return this.db.prepare('DELETE FROM socios WHERE id = ?').run(id).changes > 0;
  }

  tieneHistorialPrestamos(id) {
    return this.db.prepare('SELECT 1 FROM prestamos WHERE socio_id = ? LIMIT 1').get(id) !== undefined;
  }

  contarPrestamosActivos(id) {
    return this.db.prepare(`
      SELECT COUNT(*) AS cantidad FROM prestamos
      WHERE socio_id = ? AND fecha_devolucion IS NULL
    `).get(id).cantidad;
  }
}
