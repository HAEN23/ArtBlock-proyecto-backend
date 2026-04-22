import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro_artblock_2026';

export const registro = async (req: Request, res: Response): Promise<any> => {
  try {
    const { nombre_usuario, email, password } = req.body;

    const usuarioExistente = await prisma.usuario.findFirst({
      where: { OR: [{ email }, { nombre_usuario }] }
    });

    if (usuarioExistente) {
      return res.status(400).json({ exito: false, mensaje: 'El correo o nombre de usuario ya está en uso' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: { nombre_usuario, email, password_hash }
    });

    res.status(201).json({
      exito: true,
      mensaje: 'Cuenta creada exitosamente',
      usuario: { id: nuevoUsuario.id, nombre_usuario: nuevoUsuario.nombre_usuario, email: nuevoUsuario.email }
    });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    
    if (!usuario || !(await bcrypt.compare(password, usuario.password_hash))) {
      return res.status(401).json({ exito: false, mensaje: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: '2h' });
    
    const fechaExpiracion = new Date();
    fechaExpiracion.setHours(fechaExpiracion.getHours() + 2);
    
    await prisma.sesion.create({
      data: { usuario_id: usuario.id, token, expira_en: fechaExpiracion }
    });

    res.json({
      exito: true,
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: { id: usuario.id, nombre_usuario: usuario.nombre_usuario, foto_perfil_url: usuario.foto_perfil_url }
    });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error en el servidor' });
  }
};