import { Router } from 'express';
import { EncuestaController } from '../../controller/encuestaController.js';

const router = Router();
const encuestaController = new EncuestaController();

// Ruta para guardar la encuesta (POST)
router.post('/enviar', (req, res) => encuestaController.crearEncuesta(req, res));

// Ruta para que tu dashboard consulte los datos (GET)
router.get('/estadisticas', (req, res) => encuestaController.getEstadisticas(req, res));

export default router;