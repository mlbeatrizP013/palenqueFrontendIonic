import { Experiencia, Asistente } from '../interfaces/tipos';

export const experienciasIniciales: Experiencia[] = [
  {
    id: 1,
    nombre: 'Cata de Tequila Ultra Premium',
    fecha: '2025-11-15',
    hora: '19:00',
    descripcion: 'Exclusiva cata de tequilas ultra premium con maridaje.',
    creadoEn: new Date('2025-11-01')
  },
  {
    id: 2,
    nombre: 'Tour Destilería El Palenque',
    fecha: '2025-11-20',
    hora: '10:00',
    descripcion: 'Visita guiada a nuestra destilería con degustación.',
    creadoEn: new Date('2025-11-02')
  },
  {
    id: 3,
    nombre: 'Taller de Coctelería',
    fecha: '2025-11-25',
    hora: '18:00',
    descripcion: 'Aprende a preparar cocteles con tequila de la mano de expertos.',
    creadoEn: new Date('2025-11-03')
  }
];

export const asistentesIniciales: Asistente[] = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    correo: 'juan@ejemplo.com',
    estado: 'aprobada',
    fechaSolicitud: new Date('2025-11-03'),
    experienciaId: 1
  },
  {
    id: 2,
    nombre: 'María García',
    correo: 'maria@ejemplo.com',
    estado: 'pendiente',
    fechaSolicitud: new Date('2025-11-04'),
    experienciaId: 1
  },
  {
    id: 3,
    nombre: 'Carlos Rodríguez',
    correo: 'carlos@ejemplo.com',
    estado: 'pendiente',
    fechaSolicitud: new Date('2025-11-05'),
    experienciaId: 2
  },
  {
    id: 4,
    nombre: 'Ana López',
    correo: 'ana@ejemplo.com',
    estado: 'rechazada',
    fechaSolicitud: new Date('2025-11-06'),
    experienciaId: 2
  }
];