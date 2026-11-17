/*
 * Trabajo Práctico: Uso de Memoria en Objetos e Instancias
 *
 * Ejecutar con: node index.js
 */

// -----------------------------------------------------------------------------
// Parte 1 – Análisis (sin código)
// -----------------------------------------------------------------------------
//
// ¿Qué pasa al hacer `new Dog('Rex')`?
// Se crea un objeto nuevo (una instancia de Dog), se ejecuta el constructor y
// se inicializan sus propiedades. La variable que recibe el resultado guarda
// una referencia a ese objeto.
//
// ¿Por qué dog1 y dog2 son distintos?
// Cada llamada a `new Dog(...)` crea una instancia nueva. Aunque ambas tengan
// el mismo nombre, son objetos diferentes y ocupan identidades distintas.
//
// Primitiva frente a wrapper:
//   const nombre = 'fede';
//   const nombre2 = new String('fede');
// `nombre` es una primitiva string. `nombre2` es un objeto String que envuelve
// una primitiva; normalmente no hace falta y puede causar sorpresas en
// comparaciones y conversiones. Por ejemplo, nombre === nombre2 es false.
//
// Esquema didáctico de Stack y Heap:
//
//   STACK (variables / referencias)       HEAP (objetos)
//   ┌──────────────────────────┐          ┌─────────────────────┐
//   │ dog1 ────────────────────┼─────────>│ Dog { name: 'Rex' } │
//   │ dog2 ────────────────────┼──────┐   └─────────────────────┘
//   └──────────────────────────┘      │   ┌─────────────────────┐
//                                     └──>│ Dog { name: 'Rex' } │
//                                         └─────────────────────┘
//
//   Las primitivas como números y strings se muestran directamente como
//   valores en el modelo simplificado. En JavaScript, el estándar no exige
//   que cada valor se almacene físicamente en una región concreta; Stack/Heap
//   sirve aquí como esquema para entender referencias e identidad.

// -----------------------------------------------------------------------------
// Parte 2 – Código: detectar problemas y refactorizar
// -----------------------------------------------------------------------------
// Malas prácticas del ejemplo original:
// - `new String`, `new Number` y `new Boolean` crean objetos wrapper sin
//   necesidad; es preferible usar las primitivas.
// - `new Boolean(false)` es un objeto y, por eso, resulta truthy en una
//   condición. Esto puede provocar errores difíciles de detectar.
// - `nombre + apellido` convierte los wrappers a texto, pero no agrega un
//   espacio entre las palabras.
//
// Versión recomendada:
const nombre = 'Juan';
const apellido = 'Perez';
const nombreCompleto = `${nombre} ${apellido}`;
const edad = 30;
const activo = true;

console.log('PARTE 2 – Valores primitivos');
console.log({ nombre, apellido, nombreCompleto, edad, activo });

// -----------------------------------------------------------------------------
// Parte 3 – Refactor de User
// -----------------------------------------------------------------------------
class User {
  constructor(name) {
    // Guardamos un string primitivo, no un objeto String.
    this.name = name;
  }
}

const user1 = new User('Ana');
const user2 = new User('Ana');

console.log('\nPARTE 3 – Instancias de User');
console.log('Mismo objeto:', user1 === user2); // false
console.log('Mismo nombre:', user1.name === user2.name); // true

// -----------------------------------------------------------------------------
// Parte 4 – Instancias y duplicación
// -----------------------------------------------------------------------------
class Dog {
  constructor(name) {
    this.name = name;
  }
}

const dog1 = new Dog('Rex');
const dog2 = new Dog('Rex');

console.log('\nPARTE 4 – Instancias de Dog');
console.log('Misma instancia:', dog1 === dog2); // false
console.log('Mismo valor en name:', dog1.name === dog2.name); // true
// No hay una duplicación accidental: se solicitaron dos instancias. Si la
// aplicación necesita compartir un único perro, debe reutilizar una referencia
// existente en vez de llamar dos veces a `new Dog(...)`.

// -----------------------------------------------------------------------------
// Parte 5 – Desafío: Singleton Config
// -----------------------------------------------------------------------------
// Un Singleton centraliza el acceso a una instancia. La configuración pasada
// en la primera llamada inicializa esa instancia; las llamadas siguientes
// devuelven el mismo objeto.
const CONFIG_TOKEN = Symbol('Config constructor token');

class Config {
  static #instance;

  constructor(token, { url = 'http://localhost', port = 3000 } = {}) {
    if (token !== CONFIG_TOKEN) {
      throw new Error('Usá Config.getInstance() para obtener la configuración.');
    }

    this.url = url;
    this.port = port;
  }

  static getInstance(options) {
    if (!Config.#instance) {
      Config.#instance = new Config(CONFIG_TOKEN, options);
    }
    return Config.#instance;
  }
}

// Distintos módulos/objetos pueden pedir la configuración y reciben la misma
// referencia. Solo los valores de la primera llamada inicializan el Singleton.
const configDeServidor = Config.getInstance({
  url: 'https://api.ejemplo.com',
  port: 8080,
});
const configDeCliente = Config.getInstance();

console.log('\nPARTE 5 – Singleton Config');
console.log('Misma instancia:', configDeServidor === configDeCliente); // true
console.log('URL:', configDeCliente.url);
console.log('Puerto:', configDeCliente.port);

// La construcción directa está bloqueada para evitar crear otra instancia.
try {
  new Config();
} catch (error) {
  console.log('Constructor directo bloqueado:', error.message);
}

// -----------------------------------------------------------------------------
// Bonus – Uso de memoria en Node.js
// -----------------------------------------------------------------------------
// process.memoryUsage() informa el uso del proceso completo, no el tamaño de
// un objeto individual. Los resultados pueden variar entre ejecuciones.
if (typeof process !== 'undefined' && typeof process.memoryUsage === 'function') {
  console.log('\nBONUS – Memoria del proceso Node.js (bytes)');
  console.log(process.memoryUsage());
}
