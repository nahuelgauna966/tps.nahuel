public enum TipoCuenta {
    CAJA_DE_AHORRO("Caja de Ahorro"),
    CUENTA_CORRIENTE("Cuenta Corriente");

    private final String descripcion;

    TipoCuenta(String descripcion) {
        this.descripcion = descripcion;
    }

    @Override
    public String toString() {
        return descripcion;
    }
}
