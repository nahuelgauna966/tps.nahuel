import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createApp } from '../src/app.js';
import { createDatabase } from '../src/dao/database.js';

let db;
let server;
let baseUrl;

before(async () => {
  db = createDatabase(':memory:');
  server = createServer(createApp({ db }));
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  db.close();
});

beforeEach(() => {
  db.exec('DELETE FROM prestamos; DELETE FROM socios; DELETE FROM libros;');
});

async function request(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: body === undefined ? {} : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json();
  return { status: response.status, data };
}

async function crearLibro({ ejemplaresTotales = 2, titulo = 'El principito' } = {}) {
  const { status, data } = await request('/libros', {
    method: 'POST',
    body: { isbn: `ISBN-${Math.random()}`, titulo, autor: 'A. de Saint-Exupéry', ejemplaresTotales },
  });
  assert.equal(status, 201);
  return data;
}

async function crearSocio({ documento = `DOC-${Math.random()}`, bloqueado = false } = {}) {
  const { status, data } = await request('/socios', {
    method: 'POST',
    body: { documento, nombre: 'Ana Pérez', email: null, bloqueado },
  });
  assert.equal(status, 201);
  return data;
}

test('CRUD de libros y socios permite crear, listar, obtener, actualizar y eliminar', async () => {
  const libro = await crearLibro();
  assert.equal((await request('/libros')).data.length, 1);
  assert.equal((await request(`/libros/${libro.id}`)).data.titulo, 'El principito');
  const actualizado = await request(`/libros/${libro.id}`, { method: 'PUT', body: { titulo: 'El Principito' } });
  assert.equal(actualizado.status, 200);
  assert.equal(actualizado.data.titulo, 'El Principito');
  assert.equal((await request(`/libros/${libro.id}`, { method: 'DELETE' })).status, 200);

  const socio = await crearSocio();
  assert.equal((await request('/socios')).data.length, 1);
  assert.equal((await request(`/socios/${socio.id}`)).data.nombre, 'Ana Pérez');
  const socioActualizado = await request(`/socios/${socio.id}`, { method: 'PUT', body: { nombre: 'Ana P.' } });
  assert.equal(socioActualizado.status, 200);
  assert.equal(socioActualizado.data.nombre, 'Ana P.');
  assert.equal((await request(`/socios/${socio.id}`, { method: 'DELETE' })).status, 200);
});

test('crear préstamo descuenta disponibilidad y devolverlo la aumenta', async () => {
  const libro = await crearLibro({ ejemplaresTotales: 1 });
  const socio = await crearSocio();
  const prestamo = await request('/prestamos', {
    method: 'POST',
    body: { socioId: socio.id, libroId: libro.id },
  });
  assert.equal(prestamo.status, 201);
  assert.equal(prestamo.data.activo, true);
  assert.equal((await request(`/libros/${libro.id}`)).data.ejemplaresDisponibles, 0);

  const devolucion = await request(`/prestamos/${prestamo.data.id}/devolucion`, { method: 'POST', body: {} });
  assert.equal(devolucion.status, 200);
  assert.equal(devolucion.data.activo, false);
  assert.equal((await request(`/libros/${libro.id}`)).data.ejemplaresDisponibles, 1);
});

test('rechaza préstamo a socio bloqueado', async () => {
  const libro = await crearLibro();
  const socio = await crearSocio({ bloqueado: true });
  const response = await request('/prestamos', {
    method: 'POST',
    body: { socioId: socio.id, libroId: libro.id },
  });
  assert.equal(response.status, 409);
  assert.equal(response.data.error.codigo, 'SOCIO_BLOQUEADO');
});

test('rechaza prestar un libro sin ejemplares disponibles', async () => {
  const libro = await crearLibro({ ejemplaresTotales: 1 });
  const socio1 = await crearSocio();
  const socio2 = await crearSocio();
  assert.equal((await request('/prestamos', { method: 'POST', body: { socioId: socio1.id, libroId: libro.id } })).status, 201);
  const response = await request('/prestamos', { method: 'POST', body: { socioId: socio2.id, libroId: libro.id } });
  assert.equal(response.status, 409);
  assert.equal(response.data.error.codigo, 'SIN_STOCK');
});

test('limita a tres préstamos activos por socio', async () => {
  const socio = await crearSocio();
  const libros = await Promise.all([
    crearLibro({ titulo: 'Libro 1' }),
    crearLibro({ titulo: 'Libro 2' }),
    crearLibro({ titulo: 'Libro 3' }),
    crearLibro({ titulo: 'Libro 4' }),
  ]);
  for (const libro of libros.slice(0, 3)) {
    assert.equal((await request('/prestamos', { method: 'POST', body: { socioId: socio.id, libroId: libro.id } })).status, 201);
  }
  const cuarto = await request('/prestamos', {
    method: 'POST',
    body: { socioId: socio.id, libroId: libros[3].id },
  });
  assert.equal(cuarto.status, 409);
  assert.equal(cuarto.data.error.codigo, 'LIMITE_PRESTAMOS');
});

test('rechaza borrar socio o libro con historial y evita doble devolución', async () => {
  const libro = await crearLibro();
  const socio = await crearSocio();
  const prestamo = await request('/prestamos', { method: 'POST', body: { socioId: socio.id, libroId: libro.id } });
  assert.equal((await request(`/libros/${libro.id}`, { method: 'DELETE' })).status, 409);
  assert.equal((await request(`/socios/${socio.id}`, { method: 'DELETE' })).status, 409);
  assert.equal((await request(`/prestamos/${prestamo.data.id}/devolucion`, { method: 'POST', body: {} })).status, 200);
  const dobleDevolucion = await request(`/prestamos/${prestamo.data.id}/devolucion`, { method: 'POST', body: {} });
  assert.equal(dobleDevolucion.status, 409);
});

test('responde errores claros para datos inválidos y recursos inexistentes', async () => {
  const invalido = await request('/libros', {
    method: 'POST',
    body: { isbn: '', titulo: 'Libro', autor: 'Autor', ejemplaresTotales: 0 },
  });
  assert.equal(invalido.status, 400);
  assert.equal(invalido.data.error.codigo, 'VALIDACION');
  assert.equal((await request('/libros/999')).status, 404);
  assert.equal((await request('/ruta-inexistente')).status, 404);
});
