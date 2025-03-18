import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AgendamentoService {
  private apiUrl = 'http://localhost:5000/agendamento';

  constructor(private http: HttpClient) { }

  criarAgendamento(data_hora: string, id_cliente: string, id_servico: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, { data_hora, id_cliente, id_servico, estado: 'PENDENTE'});
  }

  alterarAgendamento(id: number, data_hora: string, id_cliente: string, id_servico: string, estado: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/`, { data_hora, id_cliente, id_servico, estado });
  }

  listarTodosAgendamentos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/`);
  }

  listarAgendamentosDoCliente(id_cliente: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cliente/${id_cliente}`);
  }
}
