import { EstadoAgendamento } from "@prisma/client";
import { Agendamento } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export class AgendamentoService {
  async listarTodosAgendamentos() {
    try {
      return await prisma.agendamento.findMany();
    } catch (error) {
      throw new Error("Erro ao listar agendamentos");
    }
  }

  async criarAgendamento(agendamento: Agendamento) {
    try {
      return await prisma.agendamento.create({
        data: {
          data_hora: new Date(agendamento.data_hora),
          id_servico: agendamento.id_servico,
          id_cliente: Number(agendamento.id_cliente),
          estado: agendamento.estado as EstadoAgendamento
        }
      });
    } catch (error) {
      console.log("Erro ao criar agendamento: "+error)
      throw new Error("Erro ao criar agendamento: "+error);
    }
  }

  async alterarAgendamento(id: string, agendamento: Agendamento) {
    try {
      const agendamentoAlterado = await prisma.agendamento.update({
        data: {
          data_hora: agendamento.data_hora,
          id_servico: agendamento.id_servico,
          id_cliente: agendamento.id_cliente,
          estado: agendamento.estado as EstadoAgendamento
        },
        where: {
          id: +id,
        },
      });
      return { ok: true, data: agendamentoAlterado };
    } catch (error) {
      console.log("Erro ao alterar agendamento: "+error)
      throw new Error("Erro ao alterar agendamento: "+error);
    }
  }

  async listarAgendamentosDeCliente(id_cliente: number) {
    try {
      return await prisma.agendamento.findMany({
        where: {
          id_cliente: id_cliente
        }
      });
    } catch (error) {
      throw new Error("Erro ao encontrar agendamentos desse cliente ");
    }
  }
  
  async buscarAgendamentoPorId(id: number) {
    return await prisma.agendamento.findUnique({ where: { id } });
  }
}
