# TP 7 – Métodos heredados de `object` en Python

## Objetivo

Crear una clase `Persona` con nombre, edad y email y observar métodos especiales que todas las clases heredan de `object`. Luego, sobrescribir `__str__`, `__repr__` y `__eq__` para personalizar su comportamiento.

## Ejecutar

Con Python 3 instalado, desde esta carpeta:

```bash
python3 persona_demo.py
```

El programa muestra primero una clase sin sobrescribir los métodos y después la clase `Persona` personalizada. Crea dos objetos con los mismos datos, imprime sus representaciones, compara igualdad, muestra el tipo, obtiene el hash cuando corresponde y lista algunos métodos especiales de `dir()`.

## Preguntas

### ¿Qué imprime el objeto antes de sobrescribir `__str__()`?

`print(persona)` usa la representación predeterminada heredada de `object`, similar a `<__main__.PersonaPorDefecto object at 0x...>`. La dirección es ilustrativa y puede variar en cada ejecución. Antes de redefinir `__str__`, `str(persona)` usa la representación disponible de `__repr__`; como tampoco está sobrescrita, también muestra el formato predeterminado del objeto.

### ¿Qué cambia después de implementar `__str__()`?

`print(persona)` y `str(persona)` muestran el texto amigable definido por el programa, por ejemplo `Fede, 25 años (fede@example.com)`, en lugar de la representación predeterminada con la clase y una dirección.

### ¿Por qué `p1 == p2` primero da `False`?

La igualdad heredada de `object` compara identidad: pregunta si `p1` y `p2` son el mismo objeto. Aunque sus datos coincidan, se crearon dos instancias diferentes, por eso la comparación da `False`.

### ¿Por qué después puede dar `True`?

La versión de `Persona` redefine `__eq__()` para comparar nombre, edad y email. Si los tres datos coinciden, dos instancias distintas se consideran iguales por valor.

### ¿Qué relación tienen `__eq__()` y `__hash__()`?

Los objetos considerados iguales deben tener el mismo hash: si `a == b`, entonces debe cumplirse `hash(a) == hash(b)`. El hash no reemplaza la comparación de igualdad; las colecciones como `set` y `dict` los usan en conjunto. Como `Persona` es mutable y compara por sus atributos, queda no hashable (`__hash__ = None`): `hash(persona)` lanza `TypeError`. Esto evita que cambien los datos y, con ellos, el hash de un objeto usado como clave. Una alternativa sería hacer `Persona` inmutable y definir un hash basado exactamente en los mismos campos que `__eq__()`.

La clase `PersonaPorDefecto` no redefine `__eq__()`, así que mantiene la igualdad por identidad y el hash heredado de `object`.

### ¿Cuál sería el equivalente de `getClass()` de Java en Python?

La función `type(objeto)`. Por ejemplo, `type(p1)` devuelve `<class '__main__.Persona'>`. También se puede consultar `objeto.__class__`, aunque normalmente se prefiere `type(objeto)`.

## Métodos de `object` observados

`dir(objeto)` devuelve una lista de atributos y métodos disponibles, incluidos los heredados y los definidos en la clase. El programa filtra algunos métodos especiales para que se vean con claridad: `__class__`, `__eq__`, `__hash__`, `__repr__` y `__str__`.
