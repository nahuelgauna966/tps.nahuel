public class EmpleadoPorHora extends Empleado {
    private final double horas_trabajadas;

    public EmpleadoPorHora(String nombre, double valor_por_hora, double horas_trabajadas) {
        super(nombre, valor_por_hora);
        this.horas_trabajadas = horas_trabajadas;
    }

    @Override
    public void mostrar_info() {
        super.mostrar_info();
        System.out.println("Horas trabajadas: " + horas_trabajadas);
    }

    @Override
    public double calcular_salario() {
        return getSalarioBase() * horas_trabajadas;
    }
}