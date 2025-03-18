import { TipoUsuario } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const bcrypt = require('bcryptjs');

export const prisma = new PrismaClient();

export class UsuarioService {
  async listarTodosUsuarios() {
    return await prisma.usuario.findMany();
  }

  async criarUsuario(nome: string, email: string, senha: string, telefone: string, tipo: string) {
    if (!Object.values(TipoUsuario).includes(tipo as TipoUsuario)) {
      throw new Error("Tipo de usuário inválido");
    }
    const senhaEncriptada = await bcrypt.hash(senha, 10);
    try{
      return await prisma.usuario.create({
        data: { nome, email, senha: senhaEncriptada, telefone, tipo: tipo as TipoUsuario },
      });
    } catch(error){
      console.log("Erro ao criar usuário: "+error)
    }
    
  }

  async buscarUsuarioPorId(id: number) {
    return await prisma.usuario.findUnique({ where: { id } });
  }
  async buscarUsuariosProfissionais() {
    return await prisma.usuario.findMany({ where: { tipo: "PROFISSIONAL" as TipoUsuario } });
  }
}
