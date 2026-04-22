import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../config/prisma';
import cloudinary from '../config/cloudinary';

// 1. PUBLICAR NUEVA OBRA
export const subirObra = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ exito: false, mensaje: 'No se incluyó ninguna imagen' });
    }

    const { titulo } = req.body;
    const id_del_usuario = req.usuario.id; 
    const tipo_de_archivo = req.file.mimetype; 

    // Subida a Cloudinary
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

// 2. OBTENER OBRAS DEL USUARIO LOGUEADO
export const obtenerMisObras = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id_del_usuario = req.usuario.id;

    const obras = await prisma.obra.findMany({
      where: { artista_id: id_del_usuario },
      orderBy: { creado_en: 'desc' }
    });

    res.json({ exito: true, obras });

  } catch (error) {
    console.error("Error al obtener las obras:", error);
    res.status(500).json({ exito: false, mensaje: 'Error interno al consultar la base de datos' });
  }
};

// 3. EDITAR TÍTULO DE UNA OBRA
export const editarObra = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string; 
    const { titulo } = req.body;
    const id_del_usuario = req.usuario.id;

    // Verificamos que la obra exista y pertenezca al usuario
    const obra = await prisma.obra.findUnique({ where: { id } });
    
    if (!obra || obra.artista_id !== id_del_usuario) {
      return res.status(403).json({ exito: false, mensaje: 'No autorizado para editar esta obra' });
    }

    const obraActualizada = await prisma.obra.update({
      where: { id },
      data: { titulo }
    });

    res.json({ exito: true, mensaje: 'Título actualizado con éxito', obra: obraActualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ exito: false, mensaje: 'Error al actualizar la obra' });
  }
};

// 4. ELIMINAR OBRA PERMANENTEMENTE
export const eliminarObra = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const id_del_usuario = req.usuario.id;

    const obra = await prisma.obra.findUnique({ where: { id } });
    
    if (!obra || obra.artista_id !== id_del_usuario) {
      return res.status(403).json({ exito: false, mensaje: 'No autorizado para eliminar esta obra' });
    }

    await prisma.obra.delete({ where: { id } });
    
    res.json({ exito: true, mensaje: 'Obra eliminada permanentemente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ exito: false, mensaje: 'Error al eliminar la obra' });
  }
};

// ==========================================
// 5. NUEVA FUNCIÓN: OBTENER EL FEED PÚBLICO
// ==========================================
export const obtenerFeedPublico = async (req: Request, res: Response): Promise<any> => {
  try {
    const pagina = parseInt(req.query.pagina as string) || 1;
    const limite = parseInt(req.query.limite as string) || 6; 
    const saltar = (pagina - 1) * limite;

    const obras = await prisma.obra.findMany({
      skip: saltar,
      take: limite,
      orderBy: { creado_en: 'desc' },
      // ¡AQUÍ ESTÁ LA MAGIA! Le pedimos a Prisma que incluya el nombre del artista
      include: {
        artista: {
          select: {
            nombre_usuario: true
          }
        }
      }
    });

    const totalObras = await prisma.obra.count();
    const tieneMas = (saltar + obras.length) < totalObras;

    res.json({ 
      exito: true, 
      obras, 
      tieneMas 
    });

  } catch (error) {
    console.error("Error al cargar el feed:", error);
    res.status(500).json({ exito: false, mensaje: 'Error al cargar las obras públicas' });
  }
};