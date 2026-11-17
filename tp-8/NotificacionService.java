import java.util.Objects;

public class NotificacionService {
    private final Mensajeria mensajeria;

    public NotificacionService(Mensajeria mensajeria) {
        this.mensajeria = Objects.requireNonNull(mensajeria, "El medio de mensajería es obligatorio.");
    }

    public void notificar(String mensaje) {
        if (mensaje == null || mensaje.isBlank()) {
            throw new IllegalArgumentException("El mensaje no puede estar vacío.");
        }
        mensajeria.enviar(mensaje);
    }
}
