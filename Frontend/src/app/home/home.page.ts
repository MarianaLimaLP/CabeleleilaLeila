import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgendamentoService } from '../services/agendamento.service';
import { ServicoService } from '../services/servico.service';
import { UsuarioService } from '../services/usuario.service';
import { format } from 'date-fns';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  agendamentos: any[] = [];
  agendamentoForm: FormGroup;
  mostrarModal = false;
  servicos: any[] = [];
  horariosDisponiveis: string[] = [];
  telefoneProfissional = '(11) 99999-9999';
  isProfissional = false;

  constructor(
    private fb: FormBuilder,
    private agendamentoService: AgendamentoService,
    private servicoService: ServicoService,
    private usuarioService: UsuarioService
  ) {
    this.agendamentoForm = this.fb.group({
      servico: ['', Validators.required],
      data_hora: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.carregarServicos();
    this.carregarAgendamentos();
    this.verificarTipoUsuario();
  }

  verificarTipoUsuario() {
    const id = localStorage.getItem('id');
    if (!id) {
      console.log("Erro");
      return;
    }
    console.log("Aqui: ");
    this.usuarioService.buscarPorId(id).subscribe((usuario) => {
      console.log("usuario: "+usuario.data);
      if (usuario.tipo == 'PROFISSIONAL')
        this.isProfissional = true
    });
  }

  carregarAgendamentos() {
    const id_cliente = localStorage.getItem('id');
  
    if (!this.isProfissional) {
      this.agendamentoService.listarTodosAgendamentos().subscribe((agendamentos) => {
        this.agendamentos = agendamentos
          .filter((agendamento: { id_cliente: string | null; }) => agendamento.id_cliente == id_cliente)
          .map((ag: { id_servico: any; id_cliente: string; }) => ({
            ...ag,
            servicoNome: this.servicos.find(serv => serv.id === ag.id_servico)?.nome || 'Desconhecido',
            duracao: this.servicos.find(serv => serv.id === ag.id_servico)?.horas || 1,
            clienteNome: this.buscarNomeClienteLocal(ag.id_cliente),
          }));
      });
    } else {
      this.agendamentoService.listarTodosAgendamentos().subscribe((agendamentos) => {
        this.agendamentos = agendamentos.map((ag: { id_servico: any; id_cliente: string; }) => ({
          ...ag,
          servicoNome: this.servicos.find(serv => serv.id === ag.id_servico)?.nome || 'Desconhecido',
          duracao: this.servicos.find(serv => serv.id === ag.id_servico)?.horas || 1,
          clienteNome: this.buscarNomeClienteLocal(ag.id_cliente),
        }));
      });
    }
  }
  
  buscarNomeClienteLocal(id_cliente: string) {
    this.usuarioService.buscarPorId(id_cliente).subscribe((cliente) => {
      return cliente.nome;
    });
  }
  

  buscarNomeCliente(id_cliente: string) {
    this.usuarioService.buscarPorId(id_cliente).subscribe((cliente) => {
      return cliente.nome;
    });
  }

  async carregarServicos() {
    await this.servicoService.listarTodosServicos().subscribe((servicos) => {
      this.servicos = servicos;
    });
  }

  mostrarModalAgendamento() {
    this.gerarHorariosDisponiveis();
    this.mostrarModal = true;
  }

  gerarHorariosDisponiveis() {
    const agora = new Date();
    const horarios = [];

    for (let hora = 8; hora < 18; hora++) {
      const data_hora = new Date();
      data_hora.setHours(hora, 0, 0);

      if (data_hora > agora && this.validarHorarioDisponivel(data_hora)) {
        horarios.push(`${hora}:00`);
      }
    }
    this.horariosDisponiveis = horarios;
  }

  validarHorarioDisponivel(data_hora: Date): boolean {
    return !this.agendamentos.some(agendamento => {
      const inicio = new Date(agendamento.data_hora);
      const fim = new Date(inicio);
      fim.setHours(inicio.getHours() + agendamento.duracao);
      return data_hora >= inicio && data_hora < fim;
    });
  }

  agendarServico() {
    const { servico, data_hora } = this.agendamentoForm.value;
    const id_cliente = localStorage.getItem('id');

    if (!id_cliente) {
      alert('Erro ao identificar o cliente.');
      return;
    }
    const data_horaFormatada = format(new Date(data_hora), "yyyy-MM-dd'T'HH:mm:ss");

    this.agendamentoService.criarAgendamento(data_horaFormatada, id_cliente, servico).subscribe(() => {
      this.mostrarModal = false;
      this.carregarAgendamentos();
    });
  }

  alterarEstadoAgendamento(agendamento: any, estado: string) {
    this.agendamentoService.alterarAgendamento(agendamento.id, agendamento.data_hora, agendamento.id_cliente, agendamento.id_servico, estado).subscribe(() => {
      this.carregarAgendamentos();
    });
  }

  editarAgendamento(agendamento: any) {
    if (!this.podeAlterar(agendamento)) {
      alert(`Não é possível alterar este agendamento. Ligue para: ${this.telefoneProfissional}`);
      return;
    }

    this.agendamentoForm.patchValue({
      servico: agendamento.id_servico,
      data_hora: format(new Date(agendamento.data_hora), "yyyy-MM-dd'T'HH:mm:ss"),
    });

    this.mostrarModal = true;
  }

  podeAlterar(agendamento: any): boolean {
    const dataAgendada = new Date(agendamento.data_hora);
    const hoje = new Date();
    const diffDias = (dataAgendada.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);
    return diffDias >= 2;
  }

  formatarData(data: string): string {
    const date = new Date(data);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // O mês é baseado em zero
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  }

  deslogar() {
    localStorage.clear();
    window.location.href = '/login';
  }
}
