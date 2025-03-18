import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export class ServicoService {
  async listarTodosServicos() {
    return await prisma.servico.findMany();
  }

  async criarServico(nome: string, horas: number) {
    return await prisma.servico.create({
      data: { nome, horas },
    });
  }

  async buscarServicoPorId(id: number) {
    return await prisma.servico.findUnique({ where: { id } });
  }
}
