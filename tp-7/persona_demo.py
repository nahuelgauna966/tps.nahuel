"""Demostración de métodos especiales heredados de object en Python.

Ejecutar con: python3 persona_demo.py
"""


class PersonaPorDefecto:
    """Persona sin redefinir __str__, __repr__, __eq__ ni __hash__."""

    def __init__(self, nombre: str, edad: int, email: str) -> None:
        self.nombre = nombre
        self.edad = edad
        self.email = email


class Persona:
    """Persona que compara por sus datos y tiene representaciones legibles."""

    # Al definir igualdad por valor y dejar la clase mutable, Python la vuelve
    # no hashable. Así no se rompe el contrato de igualdad/hash si cambia un
    # atributo después de haber usado la persona en un set o como clave.
    __hash__ = None

    def __init__(self, nombre: str, edad: int, email: str) -> None:
        if not isinstance(nombre, str) or not nombre.strip():
            raise ValueError("El nombre no puede estar vacío.")
        if not isinstance(edad, int) or isinstance(edad, bool) or edad < 0:
            raise ValueError("La edad debe ser un entero no negativo.")
        if not isinstance(email, str) or not email.strip():
            raise ValueError("El email no puede estar vacío.")

        self.nombre = nombre.strip()
        self.edad = edad
        self.email = email.strip()

    def __str__(self) -> str:
        """Texto amigable para usuarios, usado por print() y str()."""
        return f"{self.nombre}, {self.edad} años ({self.email})"

    def __repr__(self) -> str:
        """Representación explícita, útil para depuración."""
        return (
            f"Persona(nombre={self.nombre!r}, edad={self.edad!r}, "
            f"email={self.email!r})"
        )

    def __eq__(self, otro: object) -> bool:
        if not isinstance(otro, Persona):
            return NotImplemented
        return (
            self.nombre == otro.nombre
            and self.edad == otro.edad
            and self.email == otro.email
        )


def mostrar_metodos_object(objeto: object) -> None:
    """Imprime algunos nombres de métodos especiales disponibles en el objeto."""
    metodos = [
        nombre
        for nombre in dir(objeto)
        if nombre in {"__class__", "__eq__", "__hash__", "__repr__", "__str__"}
    ]
    print(", ".join(metodos))


def demostrar_comportamiento_por_defecto() -> None:
    print("=== Antes de sobrescribir métodos ===")
    p1 = PersonaPorDefecto("Fede", 25, "fede@example.com")
    p2 = PersonaPorDefecto("Fede", 25, "fede@example.com")

    print("Imprimir el objeto:", end=" ")
    print(p1)
    print("str(p1):", str(p1))
    print("repr(p1):", repr(p1))
    print("p1 == p2:", p1 == p2)
    print("hash(p1):", hash(p1))
    print("type(p1):", type(p1))
    print("Métodos especiales visibles con dir(p1):")
    mostrar_metodos_object(p1)


def demostrar_metodos_sobrescritos() -> None:
    print("\n=== Después de sobrescribir métodos ===")
    p1 = Persona("Fede", 25, "fede@example.com")
    p2 = Persona("Fede", 25, "fede@example.com")

    print("Imprimir el objeto:", p1)
    print("str(p1):", str(p1))
    print("repr(p1):", repr(p1))
    print("p1 == p2:", p1 == p2)
    print("type(p1):", type(p1))
    print("Métodos especiales visibles con dir(p1):")
    mostrar_metodos_object(p1)

    print("hash(p1):", end=" ")
    try:
        print(hash(p1))
    except TypeError as error:
        print(f"no disponible ({error})")


def main() -> None:
    demostrar_comportamiento_por_defecto()
    demostrar_metodos_sobrescritos()


if __name__ == "__main__":
    main()
