import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../config/prisma';
import cloudinary from '../config/cloudinary';

export const subirObra = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    // 1. Verificamos que el usuario haya enviado un archivo
    if (!req.file) {
      return res.status(400).json({ exito: false, mensaje: 'No se incluyó ninguna imagen' });
    }

    const { titulo } = req.body;
    const id_del_usuario = req.usuario.id; 
    
    // Extraemos el tipo de archivo real (ej. 'image/png')
    const tipo_de_archivo = req.file.mimetype; 

    // 2. Subimos la imagen a Cloudinary desde la memoria RAM
    const cloudinaryUpload = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'artblock_obras' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file?.buffer);
    });

    const resultadoCloudinary: any = await cloudinaryUpload;

    // 3. Guardamos la obra usando los nombres EXACTOS de tu schema
    const nuevaObra = await prisma.obra.create({
      data: {
        titulo,
        tipo_de_archivo, 
        imagen_url: resultadoCloudinary.secure_url,
        artista_id: id_del_usuario 
      }
    });

    res.status(201).json({
      exito: true,
      mensaje: 'Obra publicada exitosamente',
      obra: nuevaObra
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ exito: false, mensaje: 'Error al subir la obra' });
  }
};

// ==========================================
// NUEVA FUNCIÓN: OBTENER LAS OBRAS DEL USUARIO
// ==========================================
export const obtenerMisObras = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id_del_usuario = req.usuario.id;

    // Buscamos en PostgreSQL todas las obras que pertenezcan a este ID
    const obras = await prisma.obra.findMany({
      where: { 
        artista_id: id_del_usuario 
      },
      orderBy: { 
        creado_en: 'desc' // Las acomodamos para que la más nueva salga primero
      }
    });

    res.json({ 
      exito: true, 
      obras 
    });

  } catch (error) {
    console.error("Error al obtener las obras:", error);
    res.status(500).json({ exito: false, mensaje: 'Error interno al consultar la base de datos' });
  }
};