import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro_artblock_2026';

// Extendemos la interfaz Request de Express para poder guardar los datos del usuario validado
export interface AuthRequest extends Request {
  usuario?: any;
}

export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction): any => {
  // 1. Buscamos el token en las cabeceras de la petición (Headers)
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ 
      exito: false, 
      mensaje: 'Acceso denegado. Se requiere un token de autenticación.' 
    });
  }

  // 2. Extraemos solo el token (quitamos la palabra "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verificamos que el token sea real y no haya expirado
    const decodificado = jwt.verify(token, JWT_SECRET);
    
    // 4. Si es válido, guardamos la ID del usuario en la petición y lo dejamos pasar
    req.usuario = decodificado;
    next(); // "El guardia te deja pasar"
    
  } catch (error) {
    return res.status(401).json({ 
      exito: false, 
      mensaje: 'Token inválido o expirado. Vuelve a iniciar sesión.' 
    });
  }
};