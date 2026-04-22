import { Router } from 'express';
// Importamos TODAS las funciones desde el controlador
import { 
  subirObra, 
  obtenerMisObras, 
  editarObra, 
  eliminarObra, 
  obtenerFeedPublico 
} from '../controllers/obra.controller'; 
import { verificarToken } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// ==========================================
// RUTAS PÚBLICAS (No requieren haber iniciado sesión)
// ==========================================

// Ruta para obtener las obras del feed principal
router.get('/publicas', obtenerFeedPublico);


// ==========================================
// RUTAS PRIVADAS (Requieren el "Pase VIP" / verificarToken)
// ==========================================

// Ruta para subir una nueva obra (usa FormData)
router.post('/subir', verificarToken, upload.single('imagen'), subirObra);

// Ruta para obtener las obras del usuario actual
router.get('/mias', verificarToken, obtenerMisObras); 

// Ruta para editar el título de una obra (por su ID)
router.put('/:id', verificarToken, editarObra);

// Ruta para eliminar una obra (por su ID)
router.delete('/:id', verificarToken, eliminarObra);

export default router;