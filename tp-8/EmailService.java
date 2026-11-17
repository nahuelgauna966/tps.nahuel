public class EmailService implements Mensajeria {
    @Override
    public void enviar(String mensaje) {
        System.out.println("[Email] " + mensaje);
    }
}
