import { Router } from 'express';
import { EncuestaControllerV3 } from '../../controller/encuestaControllerV3.js';

const router = Router();
const controller = new EncuestaControllerV3();

router.post('/submit', (req, res) => controller.postEncuesta(req, res));
router.get('/data',   (req, res) => controller.getEncuestas(req, res));

export default router;
