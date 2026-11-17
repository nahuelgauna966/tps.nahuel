public abstract class Empleado {
    private final String nombre;
    private final double salario_base;

    public Empleado(String nombre, double salario_base) {
        this.nombre = nombre;
        this.salario_base = salario_base;
    }

    public void mostrar_info() {
        System.out.println("Nombre: " + nombre);
        System.out.printf("Salario base: $%.2f%n", salario_base);
    }

    public double getSalarioBase() {
        return salario_base;
    }

    public abstract double calcular_salario();
}