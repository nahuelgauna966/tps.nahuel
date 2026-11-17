export class PrestamoController {
  constructor({ prestamoService }) {
    this.prestamoService = prestamoService;
  }

  listar = (_req, res) => res.json(this.prestamoService.listar());

  obtener = (req, res) => res.json(this.prestamoService.obtener(req.params.id));

  crear = (req, res) => res.status(201).json(this.prestamoService.crear(req.body));

  devolver = (req, res) => res.json(this.prestamoService.devolver(req.params.id));
}
