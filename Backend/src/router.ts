import { Router } from "express";

import { UsuarioController } from "./controllers/UsuarioController";
import { AgendamentoController } from "./controllers/AgendamentoController";
import { ServicoController } from "./controllers/ServicoController";
import { login } from "./auth.controller"

const router = Router();
const usuarioController = new UsuarioController();
const agendamentoController = new AgendamentoController();
const servicoController = new ServicoController();

router.post('/auth/login', login);

router.post("/usuario/", usuarioController.criar);
router.get("/usuario/", usuarioController.listarTodos);
router.get("/usuario/id/:id", usuarioController.buscarPorId);
router.get("/usuario/profissionais/", usuarioController.buscarProfissionais);

router.post("/agendamento/", agendamentoController.criar);
router.get("/agendamento/", agendamentoController.listarTodos);
router.put("/agendamento/:id/", agendamentoController.alterar);
router.get("/agendamento/id/:id", agendamentoController.buscarPorId);
router.get("/agendamento/cliente/:id_cliente", agendamentoController.listarAgendamentosDeCliente);

router.post("/servico/", servicoController.criar);
router.get("/servico/", servicoController.listarTodos);
router.get("/servico/id/:id", servicoController.buscarPorId);

export default router;