import { Router } from 'express';
import { registro, login } from '../controllers/auth.controller';

const router = Router();

// Estas rutas automáticamente tendrán el prefijo /api/auth que le daremos en el index
router.post('/registro', registro);
router.post('/login', login);

export default router;