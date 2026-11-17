public final class Logger {
    private static final Logger INSTANCIA = new Logger();

    private Logger() {
    }

    public static Logger getInstance() {
        return INSTANCIA;
    }

    public void log(String mensaje) {
        if (mensaje == null || mensaje.isBlank()) {
            throw new IllegalArgumentException("El mensaje del log no puede estar vacío.");
        }
        System.out.println("[INFO] " + mensaje);
    }
}
