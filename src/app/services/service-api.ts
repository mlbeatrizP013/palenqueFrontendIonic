import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Producto } from '../interfaces/productos';


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
  findAllBebidas():Observable<Producto[]> {
    console.log('🔍 Intentando obtener todas las bebidas de:', `${this.urlBebidas}/findAll`);
    return this.http.get<Producto[]>(`${this.urlBebidas}/findAll`).pipe(
      tap((data) => console.log('✅ Bebidas obtenidas exitosamente:', data)),
      catchError((err) => {
        console.error('❌ Error obteniendo bebidas:', err);
        return throwError(() => err);
      })
    );
  }
  // Metodo para obtener una bebida por ID
  getBebidaById(id: number): Observable<Producto> {
    console.log('🔍 Intentando obtener bebida con ID:', id);
    return this.http.get<Producto>(`${this.urlBebidas}/findOne/${id}`).pipe(
      tap((data) => console.log('✅ Bebida obtenida exitosamente:', data)),
      catchError((err) => {
        console.error('❌ Error obteniendo bebida ID', id, ':', err);
        return throwError(() => err);
      })
    );
  }
  // Metodo para actualizar una bebida por ID
  patchBebida(id: number, data: any): Observable<Producto> {
    console.log('🔄 Intentando actualizar bebida ID:', id, 'con datos:', data);
    return this.http.patch<Producto>(`${this.urlBebidas}/update/${id}`, data).pipe(
      tap((result) => console.log('✅ Bebida actualizada exitosamente:', result)),
      catchError((err) => {
        console.error('❌ Error actualizando bebida ID', id, ':', err);
        return throwError(() => err);
      })
    );
  }
  // Metodo para crear una nueva bebida
  postBebida(data: any): Observable<Producto> {
    console.log('➕ Intentando crear nueva bebida con datos:', data);
    console.log('📋 Estructura de datos:', JSON.stringify(data, null, 2));
    return this.http.post<Producto>(`${this.urlBebidas}/create`, data).pipe(
      tap((result) => console.log('✅ Bebida creada exitosamente:', result)),
      catchError((err) => {
        console.error('❌ Error creando bebida:', err);
        console.error('❌ Status:', err.status);
        console.error('❌ Mensaje del servidor:', err.error);
        console.error('❌ Datos enviados:', data);
        if (err.status === 400) {
          console.error('⚠️ Bad Request - Posibles causas:');
          console.error('   1. categoriaId no es un número válido');
          console.error('   2. Falta algún campo requerido');
          console.error('   3. Formato de algún campo incorrecto');
          console.error('   4. El categoriaId no existe en la tabla categoria');
        }
        return throwError(() => err);
      })
    );
  }
  // Metodo para eliminar una bebida por ID
  deleteBebida(id: number): Observable<any> {
    console.log('🗑️ Intentando eliminar bebida con ID:', id);
    return this.http.delete(`${this.urlBebidas}/remove/${id}`, { responseType: 'text' as 'json' }).pipe(
      tap((result) => console.log('✅ Bebida eliminada exitosamente:', result)),
      catchError((err) => {
        console.error('❌ Error eliminando bebida ID', id, ':', err);
        return throwError(() => err);
      })
    );
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

  // metodo para obtener todas las categorias de la BD
  findAllCategorias(): Observable<any[]> {
    console.log('🔍 Intentando obtener todas las categorías de:', `${this.urlCategorias}/findAll`);
    return this.http.get<any[]>(`${this.urlCategorias}/findAll`).pipe(
      tap((data) => console.log('✅ Categorías obtenidas exitosamente:', data)),
      catchError((err) => {
        console.error('❌ Error obteniendo categorías:', err);
        return throwError(() => err);
      })
    );
  }
  // metodo para obtener bebidas por categoria (usando ID de categoría)
  getBebidasByCategoria(categoriaId: number): Observable<Producto[]> {
    console.log('🔍 Intentando obtener bebidas por categoría ID:', categoriaId);
    return this.http.get<Producto[]>(`${this.urlBebidas}/byCategoria/${categoriaId}`).pipe(
      tap((data) => console.log('✅ Bebidas por categoría obtenidas:', data)),
      catchError((err) => {
        console.error('❌ Error obteniendo bebidas por categoría ID', categoriaId, ':', err);
        return throwError(() => err);
      })
    );
  }
  // Método para obtener usuarios/asistentes por ID de la experiencia (dia-cata)
  getUsuarioByExperienciaId(experienciaId: number): Observable<any> {
    console.log('🔍 Intentando obtener asistentes de experiencia ID:', experienciaId);
    return this.http.get(`${this.urlUsuario}/visita/${experienciaId}`).pipe(
      tap((data) => console.log('✅ Asistentes obtenidos exitosamente:', data)),
      catchError((err) => {
        console.error('❌ Error obteniendo asistentes de experiencia ID', experienciaId, ':', err);
        return throwError(() => err);
      })
    );
  }
  // metodo para editar usuario
  patchUsuario(id: number, data: any): Observable<any> {
    console.log('🔍 Intentando actualizar usuario ID:', id, 'con datos:', data);
    return this.http.patch(`${this.urlUsuario}/${id}`, data).pipe(
      tap((res) => console.log('✅ Usuario actualizado exitosamente:', res)),
      catchError((err) => {
        console.error('❌ Error actualizando usuario ID', id, ':', err);
        return throwError(() => err);
      })
    );
  }
  // Método para obtener una experiencia por ID
  getExperienciaById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/findOne/${id}`);
  }
}
