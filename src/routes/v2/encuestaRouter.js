import { Router } from 'express';
import { EncuestaControllerV2 } from '../../controller/encuestaControllerV2.js';

const router = Router();
const encuestaController = new EncuestaControllerV2();

// POST: Guardar encuesta desde React
router.post('/enviar', (req, res) => encuestaController.postEncuesta(req, res));

// GET: Obtener todas las respuestas
router.get('/estadisticas', (req, res) => encuestaController.getEncuestas(req, res));

export default router;
