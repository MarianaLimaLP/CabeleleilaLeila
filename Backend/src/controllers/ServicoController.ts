import { Request, Response } from "express";
import { ServicoService } from "../services/ServicoService";

const servicoService = new ServicoService();

export class ServicoController {
  async listarTodos(req: Request, res: Response) {
    try {
      const servicos = await servicoService.listarTodosServicos();
      res.json(servicos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar serviços" });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const { nome, horas } = req.body;
      const novoServico = await servicoService.criarServico(nome, horas);
      res.status(201).json(novoServico);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar serviço" });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const servicos = await servicoService.buscarServicoPorId(Number(req.params.id));
      res.json(servicos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar serviços" });
    }
  }

}
