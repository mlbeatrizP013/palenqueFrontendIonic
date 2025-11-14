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

  constructor() {
    addIcons({ add, search, arrowBack });
    this.productos.set(productosIniciales);
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
      const productos = this.productos().map((p) =>
        p.id === productoEditar.id
          ? {
              ...p,
              ...productoData
            }
          : p
      );
      this.productos.set(productos);
    } else {
      const nuevoId = Math.max(...this.productos().map((p) => p.id), 0) + 1;
      const nuevoProducto: Producto = {
        id: nuevoId,
        ...productoData,
        fechaCreacion: new Date()
      };
      this.productos.set([...this.productos(), nuevoProducto]);
    }
    this.cancelarForm();
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
      this.productos.set(this.productos().filter((p) => p.id !== id));
      this.currentView.set('list');
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
