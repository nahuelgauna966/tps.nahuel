public class PushService implements Mensajeria {
    @Override
    public void enviar(String mensaje) {
        System.out.println("[Push] " + mensaje);
    }
}
