import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contabilidad } from '../models/contabilidad.model';

@Injectable({
  providedIn: 'root'
})
export class ContabilidadService {
  private apiUrl = '/api/contabilidad';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Contabilidad[]> {
    return this.http.get<Contabilidad[]>(this.apiUrl);
  }

  getById(id: number): Observable<Contabilidad> {
    return this.http.get<Contabilidad>(`${this.apiUrl}/${id}`);
  }

  create(contabilidad: Contabilidad): Observable<Contabilidad> {
    return this.http.post<Contabilidad>(this.apiUrl, contabilidad);
  }

  update(id: number, contabilidad: Contabilidad): Observable<Contabilidad> {
    return this.http.put<Contabilidad>(`${this.apiUrl}/${id}`, contabilidad);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
