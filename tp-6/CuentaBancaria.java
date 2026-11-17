import java.math.BigDecimal;
import java.util.Objects;

public final class CuentaBancaria {
    private final String nombreTitular;
    private final String dni;
    private final TipoCuenta tipoCuenta;
    private final Moneda moneda;
    private final boolean tarjetaDebito;
    private final boolean chequera;
    private final boolean homeBanking;
    private final BigDecimal limiteExtraccion;

    CuentaBancaria(String nombreTitular, String dni, TipoCuenta tipoCuenta, Moneda moneda,
                   boolean tarjetaDebito, boolean chequera, boolean homeBanking,
                   BigDecimal limiteExtraccion) {
        this.nombreTitular = Objects.requireNonNull(nombreTitular, "El nombre del titular es obligatorio.");
        this.dni = Objects.requireNonNull(dni, "El DNI es obligatorio.");
        this.tipoCuenta = Objects.requireNonNull(tipoCuenta, "El tipo de cuenta es obligatorio.");
        this.moneda = Objects.requireNonNull(moneda, "La moneda es obligatoria.");
        this.limiteExtraccion = Objects.requireNonNull(limiteExtraccion, "El límite de extracción es obligatorio.");

        if (nombreTitular.isBlank()) {
            throw new IllegalArgumentException("El nombre del titular no puede estar vacío.");
        }
        if (dni.isBlank()) {
            throw new IllegalArgumentException("El DNI no puede estar vacío.");
        }
        if (limiteExtraccion.signum() < 0) {
            throw new IllegalArgumentException("El límite de extracción no puede ser negativo.");
        }

        this.tarjetaDebito = tarjetaDebito;
        this.chequera = chequera;
        this.homeBanking = homeBanking;
    }

    public String getNombreTitular() {
        return nombreTitular;
    }

    public String getDni() {
        return dni;
    }

    public TipoCuenta getTipoCuenta() {
        return tipoCuenta;
    }

    public Moneda getMoneda() {
        return moneda;
    }

    public boolean tieneTarjetaDebito() {
        return tarjetaDebito;
    }

    public boolean tieneChequera() {
        return chequera;
    }

    public boolean tieneHomeBanking() {
        return homeBanking;
    }

    public BigDecimal getLimiteExtraccion() {
        return limiteExtraccion;
    }

    public String mostrarDatos() {
        return "Titular: " + nombreTitular + "\n"
                + "DNI: " + dni + "\n"
                + "Tipo de cuenta: " + tipoCuenta + "\n"
                + "Moneda: " + moneda + "\n"
                + "Tarjeta de débito: " + siNo(tarjetaDebito) + "\n"
                + "Chequera: " + siNo(chequera) + "\n"
                + "Home Banking: " + siNo(homeBanking) + "\n"
                + "Límite de extracción: " + moneda + " " + limiteExtraccion.toPlainString();
    }

    private String siNo(boolean valor) {
        return valor ? "Sí" : "No";
    }
}
