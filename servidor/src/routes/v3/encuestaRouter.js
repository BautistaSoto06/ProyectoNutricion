import { Router } from 'express';
import { EncuestaControllerV3 } from '../../controller/encuestaControllerV3.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();
const controller = new EncuestaControllerV3();

router.post('/submit',              (req, res) => controller.postEncuesta(req, res));
router.get('/data',   requireAuth,  (req, res) => controller.getEncuestas(req, res));

export default router;
