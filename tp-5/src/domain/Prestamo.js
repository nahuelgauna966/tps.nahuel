import { AppError } from './AppError.js';

export class Prestamo {
  constructor({ socioId, libroId, fechaPrestamo = new Date().toISOString().slice(0, 10) }) {
    if (!Number.isInteger(socioId) || socioId <= 0) {
      throw new AppError(400, 'VALIDACION', "El campo 'socioId' debe ser un entero positivo.");
    }
    if (!Number.isInteger(libroId) || libroId <= 0) {
      throw new AppError(400, 'VALIDACION', "El campo 'libroId' debe ser un entero positivo.");
    }
    if (!esFechaValida(fechaPrestamo)) {
      throw new AppError(400, 'VALIDACION', "El campo 'fechaPrestamo' debe tener formato YYYY-MM-DD y ser una fecha válida.");
    }
    this.socioId = socioId;
    this.libroId = libroId;
    this.fechaPrestamo = fechaPrestamo;
  }
}

export function esFechaValida(valor) {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const fecha = new Date(`${valor}T00:00:00.000Z`);
  return !Number.isNaN(fecha.valueOf()) && fecha.toISOString().slice(0, 10) === valor;
}
