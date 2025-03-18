import { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService";

const usuarioService = new UsuarioService();

export class UsuarioController {
  async listarTodos(req: Request, res: Response) {
    try {
      const usuarios = await usuarioService.listarTodosUsuarios();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const { nome, email, senha, telefone, tipo } = req.body;
      const novoUsuario = await usuarioService.criarUsuario(nome, email, senha, telefone, tipo);
      res.status(201).json(novoUsuario);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const usuario = await usuarioService.buscarUsuarioPorId(Number(req.params.id));
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar usuario" });
    }
  }
  async buscarProfissionais(req: Request, res: Response) {
    try {
      const usuarios = await usuarioService.buscarUsuariosProfissionais();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar usuarios" });
    }
  }
  
}
