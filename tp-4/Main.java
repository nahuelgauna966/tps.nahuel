import java.time.LocalDate;

public class Main {
    public static void main(String[] args) {
        Biblioteca biblioteca = new Biblioteca("Biblioteca del barrio");

        biblioteca.agregarEjemplar(new Ejemplar("L-101", "El principito"));
        biblioteca.agregarEjemplar(new Ejemplar("L-102", "Don Quijote de la Mancha"));

        Usuario ana = new Usuario("30111222", "Ana Pérez");
        Usuario tomas = new Usuario("28999888", "Tomás Gómez");
        biblioteca.registrarUsuario(ana);
        biblioteca.registrarUsuario(tomas);

        LocalDate hoy = LocalDate.now();
        System.out.println("=== Estado inicial ===");
        biblioteca.mostrarEstado();

        System.out.println("\n=== Ana realiza un préstamo ===");
        Prestamo prestamo = biblioteca.prestar(ana.getDni(), "L-101", hoy);
        System.out.println(prestamo);
        System.out.println("Préstamos asociados a Ana: " + ana.getPrestamos().size());
        biblioteca.mostrarEstado();

        System.out.println("\n=== Tomás intenta pedir el mismo ejemplar ===");
        try {
            biblioteca.prestar(tomas.getDni(), "L-101", hoy);
        } catch (IllegalStateException error) {
            System.out.println("Operación rechazada: " + error.getMessage());
        }

        System.out.println("\n=== Ana devuelve el ejemplar ===");
        biblioteca.devolver(prestamo.getId(), hoy.plusDays(7));
        biblioteca.mostrarEstado();
    }
}
