# TP 4 – Sistema de gestión de biblioteca

## Tema elegido

El programa simula una biblioteca que registra usuarios y ejemplares, permite realizar préstamos y registrar devoluciones. La prueba de uso en `Main.java` crea los objetos, los relaciona y muestra cómo cambia la disponibilidad de un ejemplar.

## Clases y relaciones

- **`Biblioteca`** administra las colecciones de ejemplares, usuarios y préstamos. Valida registros, busca las entidades y coordina las operaciones.
- **`Ejemplar`** representa una copia física de un libro. Mantiene el préstamo activo para indicar si está disponible.
- **`Usuario`** representa a una persona registrada y mantiene el historial de sus préstamos.
- **`Prestamo`** representa la operación que vincula a un usuario con un ejemplar e incluye las fechas de préstamo y devolución.
- **`Main`** es el punto de entrada que crea datos de ejemplo y demuestra las interacciones.

`Biblioteca` contiene y administra varios `Ejemplar`, `Usuario` y `Prestamo`. Cada `Prestamo` se asocia con un `Usuario` y un `Ejemplar`; el usuario conserva su historial y el ejemplar referencia el préstamo mientras está prestado. Así se observa una relación de administración/contención y asociaciones entre entidades.

## Programación orientada a objetos

Los atributos son privados para aplicar encapsulamiento y se consultan mediante getters. Los constructores validan los datos obligatorios. Las operaciones de préstamo y devolución se realizan a través de métodos que verifican que el usuario y el ejemplar existan, que el ejemplar esté disponible y que la fecha sea válida. Las listas se exponen como copias no modificables para proteger el estado interno.

## Compilar y ejecutar

Desde esta carpeta, con JDK instalado:

```bash
javac -d out *.java
java -cp out Main
```

La prueba muestra el estado inicial, el préstamo de un ejemplar, el rechazo de un segundo préstamo mientras ese ejemplar no está disponible y su devolución posterior.
