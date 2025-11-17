import { CommonModule } from '@angular/common';
import { Component, signal, computed } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, search, arrowBack } from 'ionicons/icons';
import { ProductoFormularioComponent } from '../pages/producto-formulario/producto-formulario.component';
import { ProductoCardComponent } from '../pages/producto-card/producto-card.component';
import { ServiceAPI } from '../services/service-api';
import { Producto } from '../interfaces/productos';
import { productosIniciales } from '../data/data-inicial';

import { HeaderComponent } from 'src/app/components/header/header.component';


@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    ProductoFormularioComponent,
    ProductoCardComponent,
    HeaderComponent
  ]
})
export class Tab2Page {
  productos = signal<Producto[]>([]);
  currentView = signal<'list' | 'form' | 'detalle'>('list');
  searchTerm = signal<string>('');
  filterStatus = signal<'todos' | 'activo' | 'sin_stock' | 'stock_bajo' | 'inactivo'>('todos');
  productoEditando = signal<Producto | null>(null);
  productoSeleccionado = signal<Producto | null>(null);

  productosFiltrados = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const status = this.filterStatus();

    return this.productos().filter((p) => {
      const matchSearch =
        p.nombre.toLowerCase().includes(search) ||
        p.categoria.toLowerCase().includes(search) ||
        p.descripcion.toLowerCase().includes(search);

      const matchStatus = status === 'todos' || p.estado === status;

      return matchSearch && matchStatus;
    });
  });

  constructor(private api: ServiceAPI) {
    addIcons({ add, search, arrowBack });
    // Intentamos cargar las bebidas desde la API; si falla, usamos los datos locales como fallback
    this.api.findAllBebidas().subscribe({
      next: (res: any) => {
        // Si la API devuelve un array de bebidas, mapeamos a la interfaz Producto esperada
        if (Array.isArray(res)) {
          this.productos.set(
            res.map((b: any, idx: number) => ({
              id: b.id ?? b._id ?? idx + 1,
              nombre: b.nombre ?? b.name ?? 'Sin nombre',
              categoria: b.categoria ?? b.category ?? 'Sin categoría',
              descripcion: b.descripcion ?? b.description ?? '',
              precioMXN: Number(b.precioMXN ?? b.price ?? 0),
              stockInicial: Number(b.stockInicial ?? b.stock ?? 0),
              stockActual: Number(b.stockActual ?? b.stock ?? 0),
              stockMinimo: Number(b.stockMinimo ?? 0),
              imagen: b.imagen ?? b.image ?? '',
              estado: b.estado ?? 'activo',
              fechaCreacion: b.fechaCreacion ? new Date(b.fechaCreacion) : new Date()
            }))
          );
        } else {
          // respuesta inesperada: usamos los datos iniciales
          this.productos.set(productosIniciales);
        }
      },
      error: (err) => {
        console.error('No se pudo cargar bebidas desde la API, usando datos locales', err);
        this.productos.set(productosIniciales);
      }
    });
  }

  nuevaProducto(): void {
    this.productoEditando.set(null);
    this.currentView.set('form');
  }

  onFilterChange(ev: any): void {
    // ev.detail.value can be string | undefined; coerce to the expected union
    const val = (ev?.detail?.value ?? 'todos') as any;
    this.filterStatus.set(val);
  }

  guardarProducto(productoData: Omit<Producto, 'id' | 'fechaCreacion'>): void {
    if (this.productoEditando()) {
      const productoEditar = this.productoEditando()!;
      // Llamamos al API para actualizar
      this.api.patchBebida(productoEditar.id, productoData).subscribe({
        next: (res) => {
          const productos = this.productos().map((p) =>
            p.id === productoEditar.id
              ? {
                  ...p,
                  ...productoData
                }
              : p
          );
          this.productos.set(productos);
          this.cancelarForm();
        },
        error: (err) => {
          console.error('Error actualizando bebida', err);
          // Degradado: aplicar cambios localmente aunque la API falle
          const productos = this.productos().map((p) =>
            p.id === productoEditar.id
              ? {
                  ...p,
                  ...productoData
                }
              : p
          );
          this.productos.set(productos);
          this.cancelarForm();
        }
      });
    } else {
      // Crear nueva bebida en la API
      this.api.postBebida(productoData).subscribe({
        next: (created: any) => {
          // Si el backend devuelve el recurso creado con id, usarlo; si no, generar uno local
          const newId = created?.id ?? created?._id ?? Math.max(...this.productos().map((p) => p.id), 0) + 1;
          const nuevoProducto: Producto = {
            id: newId,
            ...productoData,
            fechaCreccion: new Date() as any,
            fechaCreacion: new Date()
          } as Producto;
          this.productos.set([...this.productos(), nuevoProducto]);
          this.cancelarForm();
        },
        error: (err) => {
          console.error('Error creando bebida en la API', err);
          // fallback: crear localmente
          const nuevoId = Math.max(...this.productos().map((p) => p.id), 0) + 1;
          const nuevoProducto: Producto = {
            id: nuevoId,
            ...productoData,
            fechaCreacion: new Date()
          };
          this.productos.set([...this.productos(), nuevoProducto]);
          this.cancelarForm();
        }
      });
    }
  }

  cancelarForm(): void {
    this.productoEditando.set(null);
    this.currentView.set('list');
  }

  editarProducto(producto: Producto): void {
    this.productoEditando.set(producto);
    this.currentView.set('form');
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      // Intentamos eliminar en la API y en caso de fallo, eliminar localmente
      this.api.deleteBebida(id).subscribe({
        next: () => {
          this.productos.set(this.productos().filter((p) => p.id !== id));
          this.currentView.set('list');
        },
        error: (err) => {
          console.error('Error eliminando bebida en la API', err);
          // fallback local
          this.productos.set(this.productos().filter((p) => p.id !== id));
          this.currentView.set('list');
        }
      });
    }
  }

  verDetalle(producto: Producto): void {
    this.productoSeleccionado.set(producto);
    this.currentView.set('detalle');
  }

  volverALista(): void {
    this.productoSeleccionado.set(null);
    this.currentView.set('list');
  }

  editarDelDetalle(producto: Producto): void {
    this.productoEditando.set(producto);
    this.currentView.set('form');
  }
}
