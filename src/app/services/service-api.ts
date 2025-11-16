import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ServiceAPI {

  private baseUrl = 'http://localhost:3000/diaCata'; 
  private urlUsuario = 'http://localhost:3000/usuario';

  constructor(private http: HttpClient) {}

  // Método para obtener todos los registros de experiencias
  findAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/findAll`);
  }
  // Método para eliminar una experiencia por ID
  deleteExperiencia(id: number): Observable<any> {
    // Intentamos la ruta "delete/{id}" y si el backend responde 404 probamos
    // en orden: "/remove/{id}" y finalmente "{id}".
    // Usamos responseType: 'text' porque algunos endpoints devuelven texto plano
    // (por ejemplo mensajes 'This action removes a #7 diaCata') en lugar de JSON.
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' as 'json' }).pipe(
      catchError((err) => {
        if (err?.status === 404) {
          // Primera alternativa: DELETE /diaCata/remove/{id}
          return this.http.delete(`${this.baseUrl}/remove/${id}`, { responseType: 'text' as 'json' }).pipe(
            catchError((err2) => {
              if (err2?.status === 404) {
                // Segunda alternativa: DELETE /diaCata/{id}
                return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' as 'json' });
              }
              return throwError(() => err2);
            })
          );
        }
        return throwError(() => err);
      })
    );
  }
  // Método para actualizar una experiencia por ID
  patchExperiencia(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/update/${id}`, data);
  }
  postExperiencia(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }
  // Método para obtener todos los usuarios
  getUsuarios(): Observable<any> {
    return this.http.get(this.urlUsuario);
  }
  // Método para obtener un usuario por ID de la experiencia
  getUsuarioByExperienciaId(experienciaId: number): Observable<any> {
    return this.http.get(`${this.urlUsuario}/visita/${experienciaId}`);
  }
  // Método para obtener una experiencia por ID
  getExperienciaById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/findOne/${id}`);
  }
}
