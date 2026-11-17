import java.time.LocalDate;

public class Prestamo {
    private final int id;
    private final Usuario usuario;
    private final Ejemplar ejemplar;
    private final LocalDate fechaPrestamo;
    private LocalDate fechaDevolucion;

    Prestamo(int id, Usuario usuario, Ejemplar ejemplar, LocalDate fechaPrestamo) {
        if (id <= 0) {
            throw new IllegalArgumentException("El ID del préstamo debe ser positivo.");
        }
        if (usuario == null || ejemplar == null || fechaPrestamo == null) {
            throw new IllegalArgumentException("El préstamo requiere usuario, ejemplar y fecha.");
        }
        this.id = id;
        this.usuario = usuario;
        this.ejemplar = ejemplar;
        this.fechaPrestamo = fechaPrestamo;
    }

    public int getId() {
        return id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public Ejemplar getEjemplar() {
        return ejemplar;
    }

    public LocalDate getFechaPrestamo() {
        return fechaPrestamo;
    }

    public LocalDate getFechaDevolucion() {
        return fechaDevolucion;
    }

    public boolean estaActivo() {
        return fechaDevolucion == null;
    }

    void validarDevolucion(LocalDate fecha) {
        if (!estaActivo()) {
            throw new IllegalStateException("El préstamo ya fue devuelto.");
        }
        if (fecha == null || fecha.isBefore(fechaPrestamo)) {
            throw new IllegalArgumentException("La fecha de devolución no puede ser anterior al préstamo.");
        }
    }

    void registrarDevolucion(LocalDate fecha) {
        validarDevolucion(fecha);
        fechaDevolucion = fecha;
    }

    @Override
    public String toString() {
        String estado = estaActivo() ? "Activo" : "Devuelto el " + fechaDevolucion;
        return "Préstamo #" + id + " — " + ejemplar.getTitulo() + " para " + usuario.getNombre()
                + " (" + estado + ")";
    }
}
