import java.util.ArrayList;
import java.util.List;

public class Usuario {
    private final String dni;
    private final String nombre;
    private final List<Prestamo> prestamos = new ArrayList<>();

    public Usuario(String dni, String nombre) {
        if (dni == null || dni.isBlank()) {
            throw new IllegalArgumentException("El DNI del usuario no puede estar vacío.");
        }
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre del usuario no puede estar vacío.");
        }
        this.dni = dni;
        this.nombre = nombre;
    }

    public String getDni() {
        return dni;
    }

    public String getNombre() {
        return nombre;
    }

    public List<Prestamo> getPrestamos() {
        return List.copyOf(prestamos);
    }

    void agregarPrestamo(Prestamo prestamo) {
        prestamos.add(prestamo);
    }

    @Override
    public String toString() {
        return nombre + " (DNI " + dni + ")";
    }
}
