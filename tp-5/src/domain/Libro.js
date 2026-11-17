import { AppError } from './AppError.js';

export class Libro {
  constructor({ isbn, titulo, autor, ejemplaresTotales }) {
    this.isbn = textoObligatorio(isbn, 'isbn');
    this.titulo = textoObligatorio(titulo, 'titulo');
    this.autor = textoObligatorio(autor, 'autor');
    this.ejemplaresTotales = enteroPositivo(ejemplaresTotales, 'ejemplaresTotales');
  }
}

export function validarTextoActualizable(valor, campo) {
  return textoObligatorio(valor, campo);
}

export function validarEnteroPositivo(valor, campo) {
  return enteroPositivo(valor, campo);
}

function textoObligatorio(valor, campo) {
  if (typeof valor !== 'string' || valor.trim().length === 0) {
    throw new AppError(400, 'VALIDACION', `El campo '${campo}' es obligatorio y debe ser texto.`);
  }
  return valor.trim();
}

function enteroPositivo(valor, campo) {
  if (!Number.isInteger(valor) || valor <= 0) {
    throw new AppError(400, 'VALIDACION', `El campo '${campo}' debe ser un entero mayor que cero.`);
  }
  return valor;
}
