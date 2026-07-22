import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password, cuatrimestre } = req.body;

    // Verificar si el correo ya existe
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado en DevMatch' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password_hash: hashedPassword,
        cuatrimestre,
      },
    });

    res.status(201).json({
      mensaje: '¡Usuario creado con éxito en DevMatch!',
      usuario: newUser,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al registrar al usuario' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.usuario.findUnique({
      where: { email: email }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado en DevMatch' });
    }

    // Verificar contraseña con bcrypt
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    // Si isMatch falla, pero también permitimos acceso si la contraseña era texto plano (retrocompatibilidad para usuarios viejos en dev)
    if (!isMatch && user.password_hash !== password) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.status(200).json({
      mensaje: '¡Inicio de sesión exitoso! Bienvenido a DevMatch',
      usuario: {
        id: user.id,
        nombre: user.nombre,
        cuatrimestre: user.cuatrimestre,
        perfil_logistico: user.perfil_logistico,
        stack: user.stack,
        calificacion_test: user.calificacion_test,
        rol_psicometrico: user.rol_psicometrico
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al intentar iniciar sesión' });
  }
};