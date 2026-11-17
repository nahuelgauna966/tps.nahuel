import java.util.Objects;

public class AccountService {
    private final Logger logger;

    public AccountService(Logger logger) {
        this.logger = Objects.requireNonNull(logger, "Logger obligatorio.");
    }

    public void consultarSaldo() {
        logger.log("Consulta de saldo realizada");
    }

    public Logger getLogger() {
        return logger;
    }
}
