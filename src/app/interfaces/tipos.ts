export interface Experiencia {
  id: number;
  nombre: string;
  fecha: string;
  hora: string;
  descripcion: string;
  creadoEn: Date;
}

export interface Asistente {
  id: number;
  nombre: string;
  correo: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  fechaSolicitud: Date;
  experienciaId: number;
}