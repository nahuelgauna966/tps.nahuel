import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Empleado> empleados = new ArrayList<>();

        empleados.add(new EmpleadoTiempoCompleto("Ana López", 850000));
        empleados.add(new EmpleadoPorHora("Bruno Díaz", 5000, 120));
        empleados.add(new EmpleadoComision("Carla Ruiz", 400000, 2500000, 0.05));

        for (Empleado empleado : empleados) {
            empleado.mostrar_info();
            System.out.printf("Salario calculado: $%.2f%n", empleado.calcular_salario());
            System.out.println("------------------------------");
        }
    }
}