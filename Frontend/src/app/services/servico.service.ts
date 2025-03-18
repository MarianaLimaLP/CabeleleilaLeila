import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicoService {
  private apiUrl = 'http://localhost:5000/servico';

  constructor(private http: HttpClient) {}

  listarTodosServicos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/`);
  }

  buscarServicoPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id/${id}`);
  }
}
