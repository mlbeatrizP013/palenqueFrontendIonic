import { Experiencia, Asistente } from '../interfaces/tipos';

import { Producto } from '../interfaces/productos';

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

export const productosIniciales: Producto[] = [
  {
    id: 1,
    nombre: 'Tequila Blanco Don Julio',
    categoria: 'Tequila',
    descripcion: 'Tequila blanco 100% agave con notas de agave fresco y pimienta.',
    precioMXN: 450,
    stockInicial: 50,
    stockActual: 50,
    stockMinimo: 10,
    imagen: 'https://images.unsplash.com/photo-1608270861620-7b1c2dfdf092?w=300&h=400&fit=crop',
    estado: 'activo',
    fechaCreacion: new Date('2025-10-01')
  },
  {
    id: 2,
    nombre: 'Mezcal Oaxaqueño Artesanal',
    categoria: 'Mezcal',
    descripcion: 'Mezcal tradicional de Oaxaca con sabor ahumado y complejo.',
    precioMXN: 580,
    stockInicial: 30,
    stockActual: 3,
    stockMinimo: 10,
    imagen: 'https://images.unsplash.com/photo-1514432324607-2e467f4af445?w=300&h=400&fit=crop',
    estado: 'stock_bajo',
    fechaCreacion: new Date('2025-09-15')
  },
  {
    id: 3,
    nombre: 'Tequila Reposado Patrón',
    categoria: 'Tequila',
    descripcion: 'Tequila reposado envejecido en barril con notas de caramelo.',
    precioMXN: 650,
    stockInicial: 25,
    stockActual: 0,
    stockMinimo: 8,
    imagen: 'https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=300&h=400&fit=crop',
    estado: 'sin_stock',
    fechaCreacion: new Date('2025-10-05')
  },
  {
    id: 4,
    nombre: 'Raicilla Premium Jalisco',
    categoria: 'Raicilla',
    descripcion: 'Raicilla destilada artesanalmente con sabor único y auténtico.',
    precioMXN: 520,
    stockInicial: 40,
    stockActual: 40,
    stockMinimo: 12,
    imagen: 'https://images.unsplash.com/photo-1608270861620-7b1c2dfdf092?w=300&h=400&fit=crop',
    estado: 'activo',
    fechaCreacion: new Date('2025-10-10')
  },
  {
    id: 5,
    nombre: 'Bacanora Sonorense Antigua',
    categoria: 'Bacanora',
    descripcion: 'Bacanora tradicional de Sonora, destilada en alambique de cobre.',
    precioMXN: 480,
    stockInicial: 35,
    stockActual: 35,
    stockMinimo: 10,
    imagen: 'https://images.unsplash.com/photo-1608270861620-7b1c2dfdf092?w=300&h=400&fit=crop',
    estado: 'activo',
    fechaCreacion: new Date('2025-10-12')
  },
  {
    id: 6,
    nombre: 'Pulque de Maguey Blanco',
    categoria: 'Pulque',
    descripcion: 'Pulque tradicional con sabor refrescante y levemente agrio.',
    precioMXN: 120,
    stockInicial: 100,
    stockActual: 15,
    stockMinimo: 30,
    imagen: 'https://images.unsplash.com/photo-1608270861620-7b1c2dfdf092?w=300&h=400&fit=crop',
    estado: 'stock_bajo',
    fechaCreacion: new Date('2025-10-20')
  }
];