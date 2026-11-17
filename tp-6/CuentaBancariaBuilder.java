import java.math.BigDecimal;
import java.util.Objects;

public class CuentaBancariaBuilder {
    private final String nombreTitular;
    private final String dni;
    private TipoCuenta tipoCuenta = TipoCuenta.CAJA_DE_AHORRO;
    private Moneda moneda = Moneda.ARS;
    private boolean tarjetaDebito;
    private boolean chequera;
    private boolean homeBanking;
    private BigDecimal limiteExtraccion = BigDecimal.ZERO;

    public CuentaBancariaBuilder(String nombreTitular, String dni) {
        if (nombreTitular == null || nombreTitular.isBlank()) {
            throw new IllegalArgumentException("El nombre del titular no puede estar vacío.");
        }
        if (dni == null || dni.isBlank()) {
            throw new IllegalArgumentException("El DNI no puede estar vacío.");
        }
        this.nombreTitular = nombreTitular.trim();
        this.dni = dni.trim();
    }

    public CuentaBancariaBuilder tipoCuenta(TipoCuenta tipoCuenta) {
        this.tipoCuenta = Objects.requireNonNull(tipoCuenta, "El tipo de cuenta no puede ser nulo.");
        return this;
    }

    public CuentaBancariaBuilder moneda(Moneda moneda) {
        this.moneda = Objects.requireNonNull(moneda, "La moneda no puede ser nula.");
        return this;
    }

    public CuentaBancariaBuilder tarjetaDebito(boolean tarjetaDebito) {
        this.tarjetaDebito = tarjetaDebito;
        return this;
    }

    public CuentaBancariaBuilder chequera(boolean chequera) {
        this.chequera = chequera;
        return this;
    }

    public CuentaBancariaBuilder homeBanking(boolean homeBanking) {
        this.homeBanking = homeBanking;
        return this;
    }

    public CuentaBancariaBuilder limiteExtraccion(BigDecimal limiteExtraccion) {
        Objects.requireNonNull(limiteExtraccion, "El límite de extracción no puede ser nulo.");
        if (limiteExtraccion.signum() < 0) {
            throw new IllegalArgumentException("El límite de extracción no puede ser negativo.");
        }
        this.limiteExtraccion = limiteExtraccion;
        return this;
    }

    public CuentaBancaria build() {
        return new CuentaBancaria(nombreTitular, dni, tipoCuenta, moneda, tarjetaDebito,
                chequera, homeBanking, limiteExtraccion);
    }
}
