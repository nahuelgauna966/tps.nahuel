public class WhatsAppService implements Mensajeria {
    @Override
    public void enviar(String mensaje) {
        System.out.println("[WhatsApp] " + mensaje);
    }
}
