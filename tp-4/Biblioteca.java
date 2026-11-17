import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Biblioteca {
    private final String nombre;
    private final List<Ejemplar> ejemplares = new ArrayList<>();
    private final List<Usuario> usuarios = new ArrayList<>();
    private final List<Prestamo> prestamos = new ArrayList<>();
    private int siguienteIdPrestamo = 1;

    public Biblioteca(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre de la biblioteca no puede estar vacío.");
        }
        this.nombre = nombre;
    }

    public String getNombre() {
        return nombre;
    }

    public List<Ejemplar> getEjemplares() {
        return List.copyOf(ejemplares);
    }

    public List<Usuario> getUsuarios() {
        return List.copyOf(usuarios);
    }

    public List<Prestamo> getPrestamos() {
        return List.copyOf(prestamos);
    }

    public void agregarEjemplar(Ejemplar ejemplar) {
        if (ejemplar == null) {
            throw new IllegalArgumentException("El ejemplar no puede ser nulo.");
        }
        if (buscarEjemplar(ejemplar.getCodigo()) != null) {
            throw new IllegalArgumentException("Ya existe un ejemplar con el código " + ejemplar.getCodigo() + ".");
        }
        ejemplares.add(ejemplar);
    }

    public void registrarUsuario(Usuario usuario) {
        if (usuario == null) {
            throw new IllegalArgumentException("El usuario no puede ser nulo.");
        }
        if (buscarUsuario(usuario.getDni()) != null) {
            throw new IllegalArgumentException("Ya existe un usuario con el DNI " + usuario.getDni() + ".");
        }
        usuarios.add(usuario);
    }

    public Prestamo prestar(String dniUsuario, String codigoEjemplar, LocalDate fecha) {
        Usuario usuario = buscarUsuario(dniUsuario);
        if (usuario == null) {
            throw new IllegalArgumentException("No existe un usuario con el DNI " + dniUsuario + ".");
        }

        Ejemplar ejemplar = buscarEjemplar(codigoEjemplar);
        if (ejemplar == null) {
            throw new IllegalArgumentException("No existe un ejemplar con el código " + codigoEjemplar + ".");
        }
        if (!ejemplar.estaDisponible()) {
            throw new IllegalStateException("El ejemplar '" + ejemplar.getTitulo() + "' ya está prestado.");
        }
        if (fecha == null) {
            throw new IllegalArgumentException("La fecha del préstamo no puede ser nula.");
        }

        Prestamo prestamo = new Prestamo(siguienteIdPrestamo++, usuario, ejemplar, fecha);
        ejemplar.asignarPrestamo(prestamo);
        usuario.agregarPrestamo(prestamo);
        prestamos.add(prestamo);
        return prestamo;
    }

    public void devolver(int idPrestamo, LocalDate fecha) {
        Prestamo prestamo = buscarPrestamo(idPrestamo);
        if (prestamo == null) {
            throw new IllegalArgumentException("No existe el préstamo #" + idPrestamo + ".");
        }
        prestamo.validarDevolucion(fecha);
        prestamo.registrarDevolucion(fecha);
        prestamo.getEjemplar().finalizarPrestamo(prestamo);
    }

    public void mostrarEstado() {
        System.out.println("Biblioteca: " + nombre);
        System.out.println("Ejemplares:");
        for (Ejemplar ejemplar : ejemplares) {
            System.out.println("  - " + ejemplar);
        }
        System.out.println("Préstamos:");
        if (prestamos.isEmpty()) {
            System.out.println("  (todavía no hay préstamos)");
            return;
        }
        for (Prestamo prestamo : prestamos) {
            System.out.println("  - " + prestamo);
        }
    }

    private Usuario buscarUsuario(String dni) {
        for (Usuario usuario : usuarios) {
            if (usuario.getDni().equals(dni)) {
                return usuario;
            }
        }
        return null;
    }

    private Ejemplar buscarEjemplar(String codigo) {
        for (Ejemplar ejemplar : ejemplares) {
            if (ejemplar.getCodigo().equals(codigo)) {
                return ejemplar;
            }
        }
        return null;
    }

    private Prestamo buscarPrestamo(int id) {
        for (Prestamo prestamo : prestamos) {
            if (prestamo.getId() == id) {
                return prestamo;
            }
        }
        return null;
    }
}
