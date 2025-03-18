import { Request, Response } from "express";
import { AgendamentoService } from "../services/AgendamentoService";
import { EstadoAgendamento } from "@prisma/client";

const agendamentoService = new AgendamentoService();

export class AgendamentoController {
  async listarTodos(req: Request, res: Response) {
    try {
      const agendamentos = await agendamentoService.listarTodosAgendamentos();
      res.json(agendamentos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar agendamentos" });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const agendamento = await agendamentoService.criarAgendamento(req.body);
      res.json(agendamento);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar agendamento: "+error });
    }
  }

  async alterar(req: Request, res: Response) {
    try {
      const agendamento = await agendamentoService.alterarAgendamento(req.params.id, req.body);
      res.json(agendamento);
    } catch (error) {
      res.status(500).json({ error: "Erro ao alterar agendamento: "+error });
    }
  }

  async listarAgendamentosDeCliente(req: Request, res: Response) {
    try {
      const agendamentos = await agendamentoService.listarAgendamentosDeCliente(Number(req.params.id_cliente));
      res.json(agendamentos); 
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar agendamentos" });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const agendamento = await agendamentoService.buscarAgendamentoPorId(Number(req.params.id));
      res.json(agendamento);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar agendamento" });
    }
  }
}
