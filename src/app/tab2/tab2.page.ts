import { CommonModule } from '@angular/common';
import { Component, signal, computed, inject } from '@angular/core';
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
  IonCardContent,
  IonItem,
  IonSelect,
  IonSelectOption,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
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
    IonItem,
    IonSelect,
    IonSelectOption,
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
  categorias = signal<string[]>(['Tequila', 'Mezcal', 'Raicilla', 'Bacanora', 'Pulque']);
  selectedCategory = signal<string>('todos');

  productosFiltrados = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const status = this.filterStatus();
    const categoria = this.selectedCategory();

    return this.productos().filter((p) => {
      const matchSearch =
        p.nombre.toLowerCase().includes(search) ||
        p.categoria.toLowerCase().includes(search) ||
        p.descripcion.toLowerCase().includes(search);

      const matchStatus = status === 'todos' || p.estado === status;
      
      const matchCategory = categoria === 'todos' || p.categoria === categoria;

      return matchSearch && matchStatus && matchCategory;
    });
  });

  constructor(
    private api: ServiceAPI,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({ add, search, arrowBack });
    this.cargarBebidas();
    this.cargarCategorias();
  }

  private cargarBebidas(): void {
    this.api.findAllBebidas().subscribe({
      next: (res: any) => {
        if (Array.isArray(res) && res.length > 0) {
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
          // Sin registros en la API, lista vacía
          this.productos.set([]);
        }
      },
      error: (err) => {
        console.error('No se pudo cargar bebidas desde la API', err);
        this.productos.set([]);
      }
    });
  }

  private cargarCategorias(): void {
    this.api.findAllCategorias().subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          const cats = res.map((c: any) => c.nombre ?? c.name ?? String(c));
          this.categorias.set(cats);
        }
      },
      error: (err) => {
        console.warn('No se pudieron obtener categorías desde la API', err);
      }
    });
  }

  private async mostrarToast(mensaje: string, color: 'success' | 'danger' = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
      color: color
    });
    await toast.present();
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
          this.mostrarToast('Producto actualizado exitosamente', 'success');
          this.cancelarForm();
        },
        error: (err) => {
          console.error('Error actualizando bebida', err);
          this.mostrarToast('Error al actualizar el producto', 'danger');
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
            fechaCreacion: new Date()
          } as Producto;
          this.productos.set([...this.productos(), nuevoProducto]);
          this.mostrarToast('Producto guardado exitosamente', 'success');
          this.cancelarForm();
        },
        error: (err) => {
          console.error('Error creando bebida en la API', err);
          this.mostrarToast('Error al guardar el producto', 'danger');
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
          this.mostrarToast('Producto eliminado exitosamente', 'success');
        },
        error: (err) => {
          console.error('Error eliminando bebida en la API', err);
          this.mostrarToast('Error al eliminar el producto', 'danger');
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
