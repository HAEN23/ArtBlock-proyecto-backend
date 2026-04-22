import { Router } from 'express';
import { subirObra } from '../controllers/obra.controller';
import { verificarToken } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Ruta: POST /api/obras/subir
// 1. verificarToken valida que el usuario haya iniciado sesión
// 2. upload.single('imagen') atrapa el archivo enviado desde el frontend
router.post('/subir', verificarToken, upload.single('imagen'), subirObra);

export default router;