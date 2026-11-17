import java.util.Objects;

public class LoginService {
    private final Logger logger;

    public LoginService(Logger logger) {
        this.logger = Objects.requireNonNull(logger, "Logger obligatorio.");
    }

    public void iniciarSesion(String usuario) {
        logger.log("Usuario " + usuario + " inició sesión");
    }

    public void cerrarSesion(String usuario) {
        logger.log("Usuario " + usuario + " cerró sesión");
    }

    public Logger getLogger() {
        return logger;
    }
}
