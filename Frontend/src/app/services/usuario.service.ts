import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost:5000/usuario';

  constructor(private http: HttpClient) {}

  listarTodosUsuarios(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/`);
  }

  cadastrarCliente(nome: string, email: string, senha: string, telefone: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, { nome, email, senha, telefone, tipo: "CLIENTE" });
  }

  buscarProfissionais(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profissionais/`,);
  }

  buscarPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id/${id}`,);
  }
}
