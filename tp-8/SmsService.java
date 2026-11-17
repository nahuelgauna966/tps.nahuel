public class SmsService implements Mensajeria {
    @Override
    public void enviar(String mensaje) {
        System.out.println("[SMS] " + mensaje);
    }
}
