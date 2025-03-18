import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
const JWT_SECRET = process.env.ACCESS_JWT || 'seu_segredo_aqui';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!JWT_SECRET) {
        res.status(500).json({ message: 'Erro ao conectar com o JWT' });
        return;
    }

    const { email, senha } = req.body;

    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } });

        if (!usuario) {
            res.status(400).json({ message: 'Usuário não encontrado' });
            return;
        }

        const comparacao_senha = await bcrypt.compare(senha, usuario.senha);
        if (!comparacao_senha) {
            res.status(400).json({ message: 'Senha incorreta' });
            return;
        }

        const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, usuario: { id: usuario.id, email: usuario.email, nome: usuario.nome } });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error });
    }
};
