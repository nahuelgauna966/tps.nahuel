export class LibroController {
  constructor({ libroService }) {
    this.libroService = libroService;
  }

  listar = (_req, res) => res.json(this.libroService.listar());

  obtener = (req, res) => res.json(this.libroService.obtener(req.params.id));

  crear = (req, res) => res.status(201).json(this.libroService.crear(req.body));

  actualizar = (req, res) => res.json(this.libroService.actualizar(req.params.id, req.body));

  eliminar = (req, res) => res.json(this.libroService.eliminar(req.params.id));
}
