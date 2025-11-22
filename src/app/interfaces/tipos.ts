export interface Experiencia {
  id: number;
  name: string;           // Backend usa 'name' en lugar de 'nombre'
  description: string;    // Backend usa 'description' en lugar de 'descripcion'
  fecha: Date;            // Backend espera Date
  capacidad: number;      // Capacidad de asistentes (no puede ser negativa)
  costo: number;          // Costo del evento (no puede ser negativo)
  estado: boolean;        // Estado del evento (activo/inactivo)
  creadoEn?: Date;        // Opcional, puede que el backend lo genere automáticamente
}

export interface Asistente {
  id: number;
  nombre: string;
  correo: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  fechaSolicitud: Date;
  experienciaId: number;
}