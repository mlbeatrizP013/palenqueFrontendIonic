import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Producto } from '../interfaces/productos';

@Injectable({
  providedIn: 'root',
})
export class ServiceAPI {
  // 💡 RECOMENDACIÓN: Mover estas URLs a environments.ts para producción
  private baseUrl = 'http://localhost:3000/diaCata';
  private urlUsuario = 'http://localhost:3000/usuario';
  private urlInfoHome = 'http://localhost:3000/info-home';
  private urlBebidas = 'http://localhost:3000/bebidas';
  private urlCategorias = 'http://localhost:3000/categoria';

  constructor(private http: HttpClient) {}

  // ==========================================
  // MÉTODOS DE EXPERIENCIAS (diaCata)
  // ==========================================

  findAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/findAll`);
  }

  getExperienciaById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/findOne/${id}`);
  }

  postExperiencia(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }

  // Método con lógica de fallback (reintento en rutas alternativas)
  patchExperiencia(id: number, data: any): Observable<any> {
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

  // Método con lógica de fallback para eliminar
  deleteExperiencia(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' as 'json' }).pipe(
      catchError((err) => {
        if (err?.status === 404) {
          return this.http.delete(`${this.baseUrl}/remove/${id}`, { responseType: 'text' as 'json' }).pipe(
            catchError((err2) => {
              if (err2?.status === 404) {
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

  // ==========================================
  // MÉTODOS DE BEBIDAS
  // ==========================================

  findAllBebidas(): Observable<Producto[]> {
    console.log('🔍 Intentando obtener todas las bebidas de:', `${this.urlBebidas}/findAll`);
    return this.http.get<Producto[]>(`${this.urlBebidas}/findAll`).pipe(
      tap((data) => console.log('✅ Bebidas obtenidas exitosamente:', data)),
      catchError((err) => {
        console.error('❌ Error obteniendo bebidas:', err);
        return throwError(() => err);
      })
    );
  }

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

  postBebida(data: any): Observable<Producto> {
    console.log('➕ Intentando crear nueva bebida con datos:', data);
    return this.http.post<Producto>(`${this.urlBebidas}/create`, data).pipe(
      tap((result) => console.log('✅ Bebida creada exitosamente:', result)),
      catchError((err) => {
        console.error('❌ Error creando bebida:', err);
        if (err.status === 400) {
          console.error('⚠️ Bad Request: Revisa categoriaId o campos faltantes.');
        }
        return throwError(() => err);
      })
    );
  }

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

  // ==========================================
  // MÉTODOS DE CATEGORÍAS
  // ==========================================

  findAllCategorias(): Observable<any[]> {
    console.log('🔍 Intentando obtener todas las categorías');
    return this.http.get<any[]>(`${this.urlCategorias}/findAll`).pipe(
      tap((data) => console.log('✅ Categorías obtenidas:', data)),
      catchError((err) => {
        console.error('❌ Error obteniendo categorías:', err);
        return throwError(() => err);
      })
    );
  }

  // ==========================================
  // MÉTODOS DE INFO HOME
  // ==========================================

  findAllInfoHome(): Observable<any> {
    return this.http.get(`${this.urlInfoHome}/findAll`);
  }

  patchInfoHome(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.urlInfoHome}/update/${id}`, data);
  }

  // ==========================================
  // MÉTODOS DE USUARIOS
  // ==========================================

  getUsuarios(): Observable<any> {
    return this.http.get(this.urlUsuario);
  }

  getUsuarioByExperienciaId(experienciaId: number): Observable<any> {
    return this.http.get(`${this.urlUsuario}/visita/${experienciaId}`);
  }

  patchUsuario(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.urlUsuario}/${id}`, data);
  }
}