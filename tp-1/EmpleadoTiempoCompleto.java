public class EmpleadoTiempoCompleto extends Empleado {

    public EmpleadoTiempoCompleto(String nombre, double salario_base) {
        super(nombre, salario_base);
    }

    @Override
    public double calcular_salario() {
        return getSalarioBase();
    }
}