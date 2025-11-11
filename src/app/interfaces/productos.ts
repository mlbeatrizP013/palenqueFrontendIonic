export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  precioMXN: number;
  stockInicial: number;
  stockMinimo: number;
  imagen: string;
  estado: 'activo' | 'inactivo' | 'sin_stock' | 'stock_bajo';
  fechaCreacion: Date;
  stockActual: number;
}
