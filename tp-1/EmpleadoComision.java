public class EmpleadoComision extends Empleado {
    private final double ventas;
    private final double porcentaje_comision;

    public EmpleadoComision(String nombre, double salario_base, double ventas, double porcentaje_comision) {
        super(nombre, salario_base);
        this.ventas = ventas;
        this.porcentaje_comision = porcentaje_comision;
    }

    @Override
    public void mostrar_info() {
        super.mostrar_info();
        System.out.printf("Ventas: $%.2f%n", ventas);
        System.out.printf("Porcentaje de comisión: %.1f%%%n", porcentaje_comision * 100);
    }

    @Override
    public double calcular_salario() {
        return getSalarioBase() + ventas * porcentaje_comision;
    }
}