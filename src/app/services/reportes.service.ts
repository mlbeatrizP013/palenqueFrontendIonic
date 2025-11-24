import { Injectable } from '@angular/core';

export interface EstadisticaResumen {
  id: string;
  titulo: string;
  descripcion: string;
  total: number;
  valorA: number;
  valorB: number;
  porcentaje: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private _estadisticas: EstadisticaResumen[] = [
    {
      id: 'usuarios',
      titulo: 'Usuarios registrados',
      descripcion: 'Últimos 30 días',
      total: 120,
      valorA: 90,
      valorB: 45,
      porcentaje: 75
    },
    {
      id: 'visitas',
      titulo: 'Visitas programadas',
      descripcion: 'Próximo mes',
      total: 32,
      valorA: 20,
      valorB: 12,
      porcentaje: 62
    },
    {
      id: 'experiencias',
      titulo: 'Experiencias activas',
      descripcion: 'Inventario actual',
      total: 8,
      valorA: 6,
      valorB: 2,
      porcentaje: 80
    }
  ];

  constructor() {}

  obtenerEstadisticas(): EstadisticaResumen[] {
    return this._estadisticas;
  }
}
