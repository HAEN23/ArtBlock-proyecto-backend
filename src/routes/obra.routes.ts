import { Router } from 'express';
// Importamos ambas funciones desde el controlador
import { subirObra, obtenerMisObras } from '../controllers/obra.controller'; 
import { verificarToken } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Ruta para subir una nueva obra (usa FormData)
router.post('/subir', verificarToken, upload.single('imagen'), subirObra);

// Nueva ruta para obtener las obras del usuario actual
router.get('/mias', verificarToken, obtenerMisObras); 

export default router;