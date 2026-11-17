public class Ejemplar {
    private final String codigo;
    private final String titulo;
    private Prestamo prestamoActivo;

    public Ejemplar(String codigo, String titulo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("El código del ejemplar no puede estar vacío.");
        }
        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("El título no puede estar vacío.");
        }
        this.codigo = codigo;
        this.titulo = titulo;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getTitulo() {
        return titulo;
    }

    public boolean estaDisponible() {
        return prestamoActivo == null;
    }

    public Prestamo getPrestamoActivo() {
        return prestamoActivo;
    }

    void asignarPrestamo(Prestamo prestamo) {
        if (!estaDisponible()) {
            throw new IllegalStateException("El ejemplar ya está prestado.");
        }
        if (prestamo == null || prestamo.getEjemplar() != this) {
            throw new IllegalArgumentException("El préstamo no corresponde a este ejemplar.");
        }
        prestamoActivo = prestamo;
    }

    void finalizarPrestamo(Prestamo prestamo) {
        if (prestamoActivo != prestamo) {
            throw new IllegalStateException("El préstamo no está activo para este ejemplar.");
        }
        prestamoActivo = null;
    }

    @Override
    public String toString() {
        String estado = estaDisponible() ? "Disponible" : "Prestado";
        return titulo + " [código " + codigo + ", " + estado + "]";
    }
}
