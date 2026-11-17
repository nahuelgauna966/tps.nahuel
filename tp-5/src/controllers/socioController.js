export class SocioController {
  constructor({ socioService }) {
    this.socioService = socioService;
  }

  listar = (_req, res) => res.json(this.socioService.listar());

  obtener = (req, res) => res.json(this.socioService.obtener(req.params.id));

  crear = (req, res) => res.status(201).json(this.socioService.crear(req.body));

  actualizar = (req, res) => res.json(this.socioService.actualizar(req.params.id, req.body));

  eliminar = (req, res) => res.json(this.socioService.eliminar(req.params.id));
}
