import { Router } from 'express';
import { AdminController } from '../../controller/adminController.js';

const router = Router();
const controller = new AdminController();

router.post('/login', (req, res) => controller.login(req, res));

export default router;
