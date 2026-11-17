import java.util.List;

public class Main {
    public static void main(String[] args) {
        String mensajeInicial = "Bienvenido al sistema bancario.";

        System.out.println("=== PARTE 1: diseño inicial acoplado a Email ===");
        NotificacionServiceInicial servicioInicial = new NotificacionServiceInicial(new EmailService());
        servicioInicial.notificar(mensajeInicial);
        System.out.println("Para agregar WhatsApp a este diseño inicial habría que modificar "
                + "NotificacionServiceInicial para conocer el nuevo canal.\n");

        System.out.println("=== PARTE 2 y 3: canales intercambiables mediante Mensajeria ===");
        List<Mensajeria> canales = List.of(
                new EmailService(),
                new WhatsAppService(),
                new SmsService(),
                new PushService()
        );

        for (Mensajeria canal : canales) {
            NotificacionService servicio = new NotificacionService(canal);
            servicio.notificar("Tenés una actualización en tu cuenta.");
        }

        System.out.println("\n=== DESAFÍO OPCIONAL: una notificación por varios canales ===");
        Mensajeria variosCanales = new MensajeriaMultiple(List.of(
                new EmailService(),
                new WhatsAppService(),
                new PushService()
        ));
        NotificacionService servicioMulticanal = new NotificacionService(variosCanales);
        servicioMulticanal.notificar("Transferencia acreditada correctamente.");
    }
}
