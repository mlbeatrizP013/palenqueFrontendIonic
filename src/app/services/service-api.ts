import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceAPI {

  private baseUrl = 'http://localhost:3000/diaCata'; 
  private urlUsuario = 'http://localhost:3000/usuario';

  constructor(private http: HttpClient) {}

  // Método para obtener todos los registros
  findAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/findAll`);
  }
  patchExperiencia(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/update/${id}`, data);
  }
  postExperiencia(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }
  getUsuarios(): Observable<any> {
    return this.http.get(this.urlUsuario);
  }
}
