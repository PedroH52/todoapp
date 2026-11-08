import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarefa } from './tarefa';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(`${this.apiUrl}/getAll`);
  }

  create(descricao: string): Observable<Tarefa> {
    return this.http.post<Tarefa>(`${this.apiUrl}/post`, {
      descricao,
      statusRealizada: false
    });
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  update(id: string, dados: Partial<Tarefa>): Observable<Tarefa> {
    return this.http.patch<Tarefa>(`${this.apiUrl}/update/${id}`, dados);
  }
}
