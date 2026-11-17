import java.math.BigDecimal;
import java.util.Objects;

public class TransferService {
    private final Logger logger;

    public TransferService(Logger logger) {
        this.logger = Objects.requireNonNull(logger, "Logger obligatorio.");
    }

    public void realizarTransferencia(BigDecimal importe) {
        if (importe == null || importe.signum() <= 0) {
            throw new IllegalArgumentException("El importe de la transferencia debe ser mayor que cero.");
        }
        logger.log("Transferencia realizada por $" + importe.toPlainString());
    }

    public Logger getLogger() {
        return logger;
    }
}
