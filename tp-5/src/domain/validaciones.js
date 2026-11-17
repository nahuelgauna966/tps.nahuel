import { AppError } from './AppError.js';

export function validarId(id) {
  const numero = Number(id);
  if (!Number.isInteger(numero) || numero <= 0) {
    throw new AppError(400, 'ID_INVALIDO', 'El identificador debe ser un entero positivo.');
  }
  return numero;
}

export function validarObjeto(body) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError(400, 'VALIDACION', 'El cuerpo de la solicitud debe ser un objeto JSON.');
  }
  return body;
}
