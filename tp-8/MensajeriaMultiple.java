import java.util.List;
import java.util.Objects;

/** Composite: trata varios medios como una sola implementación de Mensajeria. */
public class MensajeriaMultiple implements Mensajeria {
    private final List<Mensajeria> canales;

    public MensajeriaMultiple(List<Mensajeria> canales) {
        Objects.requireNonNull(canales, "La lista de canales es obligatoria.");
        if (canales.isEmpty()) {
            throw new IllegalArgumentException("Debe configurarse al menos un canal.");
        }
        if (canales.stream().anyMatch(Objects::isNull)) {
            throw new IllegalArgumentException("Los canales no pueden ser nulos.");
        }
        this.canales = List.copyOf(canales);
    }

    @Override
    public void enviar(String mensaje) {
        for (Mensajeria canal : canales) {
            canal.enviar(mensaje);
        }
    }
}
