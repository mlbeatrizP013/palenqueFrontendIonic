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
  private urlInfoHome = 'http://localhost:3000/info-home';
  private urlBebidas = 'http://localhost:3000/bebidas';
  private urlCategorias = 'http://localhost:3000/categoria';

  constructor(private http: HttpClient) {}

  // Método para obtener todos los registros de experiencias
  findAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/findAll`);
  }
  // Metodo para obtener todas las bebidas
  findAllBebidas():Observable<any> {
    return this.http.get(`${this.urlBebidas}/findAll`);
  }
  // Metodo para obtener una bebida por ID
  getBebidaById(id: number): Observable<any> {
    return this.http.get(`${this.urlBebidas}/findOne/${id}`);
  }
  // Metodo para actualizar una bebida por ID
  patchBebida(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.urlBebidas}/update/${id}`, data);
  }
  // Metodo para crear una nueva bebida
  postBebida(data: any): Observable<any> {
    return this.http.post(`${this.urlBebidas}/create`, data);
  }
  // Metodo para eliminar una bebida por ID
  deleteBebida(id: number): Observable<any> {
    return this.http.delete(`${this.urlBebidas}/delete/${id}`, { responseType: 'text' as 'json' });
  }
  //metodo para obtener bebidas por categoria
  getBebidasByCategoria(categoriaId: number): Observable<any> {
    return this.http.get(`${this.urlBebidas}/byCategoria/${categoriaId}`);
  }
  //metodo para obtener todas las categorias
  findAllCategorias():Observable<any> {
    return this.http.get(`${this.urlCategorias}/findAll`);
  }
  // Metodo para obtener toda la info home
  findAllInfoHome(): Observable<any> {
    return this.http.get(`${this.urlInfoHome}/findAll`);
  }
  //Metodo para actualizar info home
  patchInfoHome(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.urlInfoHome}/update/${id}`, data);
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
    // Intentamos el endpoint más probable y, si devuelve 404, probamos alternativas.
    return this.http.patch(`${this.baseUrl}/update/${id}`, data).pipe(
      catchError((err) => {
        console.warn('patchExperiencia: primary endpoint failed', err?.status);
        if (err?.status === 404) {
          // Fallback 1: PATCH /diaCata/{id}
          return this.http.patch(`${this.baseUrl}/${id}`, data).pipe(
            catchError((err2) => {
              console.warn('patchExperiencia: fallback 1 failed', err2?.status);
              // Fallback 2: PATCH /diaCata/update (id en body)
              return this.http.patch(`${this.baseUrl}/update`, { id, ...data }).pipe(
                catchError((err3) => {
                  console.error('patchExperiencia: all attempts failed');
                  return throwError(() => err3);
                })
              );
            })
          );
        }
        return throwError(() => err);
      })
    );
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
  // metodo para editar usuario
  patchUsuario(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.urlUsuario}/${id}`, data);
  }
  // Método para obtener una experiencia por ID
  getExperienciaById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/findOne/${id}`);
  }
}
