import java.math.BigDecimal;

public class Main {
    public static void main(String[] args) {
        CuentaBancaria cuentaBasica = new CuentaBancariaBuilder("Fede Pérez", "30111222")
                .tipoCuenta(TipoCuenta.CAJA_DE_AHORRO)
                .moneda(Moneda.ARS)
                .homeBanking(true)
                .tarjetaDebito(true)
                .build();

        CuentaBancaria cuentaPremium = new CuentaBancariaBuilder("Lucía Gómez", "28999888")
                .tipoCuenta(TipoCuenta.CUENTA_CORRIENTE)
                .moneda(Moneda.USD)
                .homeBanking(true)
                .tarjetaDebito(true)
                .chequera(true)
                .limiteExtraccion(new BigDecimal("2000000"))
                .build();

        System.out.println("=== Cliente básico ===");
        System.out.println(cuentaBasica.mostrarDatos());
        System.out.println("\n=== Cliente premium ===");
        System.out.println(cuentaPremium.mostrarDatos());

        Logger logger = Logger.getInstance();
        LoginService loginService = new LoginService(Logger.getInstance());
        TransferService transferService = new TransferService(Logger.getInstance());
        AccountService accountService = new AccountService(Logger.getInstance());

        System.out.println("\n=== Verificación del Singleton Logger ===");
        boolean mismaInstancia = logger == loginService.getLogger()
                && logger == transferService.getLogger()
                && logger == accountService.getLogger();
        System.out.println("Todos los servicios usan la misma instancia: " + mismaInstancia);

        System.out.println("\n=== Eventos bancarios ===");
        loginService.iniciarSesion("fede");
        transferService.realizarTransferencia(new BigDecimal("50000"));
        accountService.consultarSaldo();
        loginService.cerrarSesion("fede");
    }
}
