import { AppError } from './AppError.js';

export class Socio {
  constructor({ documento, nombre, email = null, bloqueado = false }) {
    this.documento = textoObligatorio(documento, 'documento');
    this.nombre = textoObligatorio(nombre, 'nombre');
    if (email !== null && (typeof email !== 'string' || !email.trim())) {
      throw new AppError(400, 'VALIDACION', "El campo 'email' debe ser texto o null.");
    }
    if (typeof bloqueado !== 'boolean') {
      throw new AppError(400, 'VALIDACION', "El campo 'bloqueado' debe ser booleano.");
    }
    this.email = email === null ? null : email.trim();
    this.bloqueado = bloqueado;
  }
}

function textoObligatorio(valor, campo) {
  if (typeof valor !== 'string' || valor.trim().length === 0) {
    throw new AppError(400, 'VALIDACION', `El campo '${campo}' es obligatorio y debe ser texto.`);
  }
  return valor.trim();
}
