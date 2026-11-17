import java.util.Objects;

/** Versión inicial acoplada a EmailService, para comparar con la solución DIP. */
public class NotificacionServiceInicial {
    private final EmailService emailService;

    public NotificacionServiceInicial(EmailService emailService) {
        this.emailService = Objects.requireNonNull(emailService, "EmailService obligatorio.");
    }

    public void notificar(String mensaje) {
        emailService.enviar(mensaje);
    }
}
