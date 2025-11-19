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
  categorias = signal<{id: number, nombre: string}[]>([]);
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

      // Determinar el estado real basado en stock
      let estadoReal = 'activo';
      if (p.stockActual === 0 || p.stockInicial === 0) {
        estadoReal = 'sin_stock';
      } else if (p.stockActual <= p.stockMinimo) {
        estadoReal = 'stock_bajo';
      }

      // Filtrar por estado
      const matchStatus = status === 'todos' || estadoReal === status;
      
      // Filtrar por categoría
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
    this.cargarCategorias();
    this.cargarBebidas();
  }

  private cargarBebidas(): void {
    this.api.findAllBebidas().subscribe({
      next: (res: any) => {
        if (Array.isArray(res) && res.length > 0) {
          this.productos.set(
            res.map((b: any, idx: number) => {
              const stockActual = Number(b.stockActual ?? b.stock ?? 0);
              const stockInicial = Number(b.stockInicial ?? b.stock ?? 0);
              const stockMinimo = Number(b.stockMinimo ?? 0);
              
              // Calcular estado basado en stock
              let estado: 'activo' | 'inactivo' | 'sin_stock' | 'stock_bajo' = 'activo';
              if (stockActual === 0 || stockInicial === 0) {
                estado = 'sin_stock';
              } else if (stockActual <= stockMinimo) {
                estado = 'stock_bajo';
              }

              return {
                id: b.id ?? b._id ?? idx + 1,
                nombre: b.nombre ?? b.name ?? 'Sin nombre',
                categoria: b.categoria ?? b.category ?? 'Sin categoría',
                descripcion: b.descripcion ?? b.description ?? '',
                precioMXN: Number(b.precioMXN ?? b.price ?? 0),
                stockInicial: stockInicial,
                stockActual: stockActual,
                stockMinimo: stockMinimo,
                imagen: b.imagen ?? b.image ?? '',
                estado: estado,
                fechaCreacion: b.fechaCreacion ? new Date(b.fechaCreacion) : new Date()
              };
            })
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
    // Cargar categorías desde la API (tabla categorias en BD)
    this.api.findAllCategorias().subscribe({
      next: (res: any[]) => {
        console.log('✅ Categorías recibidas de la BD:', res);
        if (Array.isArray(res) && res.length > 0) {
          // Guardar objetos completos con id y nombre
          const categoriasDelAPI = res.map((c: any) => ({
            id: c.id,
            nombre: c.nombre ?? c.name ?? String(c)
          }));
          this.categorias.set(categoriasDelAPI);
          console.log('✅ Categorías procesadas:', categoriasDelAPI);
        } else {
          console.warn('⚠️ No hay categorías en la API');
        }
      },
      error: (err) => {
        console.error('❌ Error obteniendo categorías desde la API:', err);
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

  onCategoryChange(categoriaNombre: string): void {
    this.selectedCategory.set(categoriaNombre);
    // Opcionalmente, si quieres obtener bebidas específicas de la API:
    // if (categoriaNombre !== 'todos') {
    //   this.api.getBebidasByCategoria(categoriaNombre).subscribe({
    //     next: (bebidas) => {
    //       // Manejar bebidas filtradas de la API si es necesario
    //     },
    //     error: (err) => console.error('Error obteniendo bebidas por categoría', err)
    //   });
    // }
  }

  guardarProducto(productoData: Omit<Producto, 'id' | 'fechaCreacion'>): void {
    // Buscar el ID de la categoría por nombre
    const categoriaObj = this.categorias().find(c => c.nombre === productoData.categoria);
    
    if (!categoriaObj) {
      console.error('❌ Categoría no encontrada:', productoData.categoria);
      console.error('❌ Categorías disponibles:', this.categorias());
      this.mostrarToast('Error: Categoría no válida', 'danger');
      return;
    }

    // Preparar datos exactamente como los espera el CreateBebidaDto del backend
    const dataToSend = {
      nombre: String(productoData.nombre).trim(),
      descripcion: String(productoData.descripcion).trim(),
      precio: Number(productoData.precioMXN),        // Backend espera 'precio' no 'precioMXN'
      stock: Number(productoData.stockInicial),      // Backend espera 'stock' no 'stockInicial'
      imagen: productoData.imagen ? String(productoData.imagen).trim() : 'https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=300&h=400&fit=crop',
      categoriaId: Number(categoriaObj.id)           // Backend espera 'categoriaId' como número
    };

    console.log('📤 Datos enviados al backend (formato DTO):', dataToSend);
    console.log('📋 Tipos de datos:', {
      nombre: typeof dataToSend.nombre,
      descripcion: typeof dataToSend.descripcion,
      precio: typeof dataToSend.precio + ' (valor: ' + dataToSend.precio + ')',
      stock: typeof dataToSend.stock + ' (valor: ' + dataToSend.stock + ')',
      imagen: typeof dataToSend.imagen,
      categoriaId: typeof dataToSend.categoriaId + ' (valor: ' + dataToSend.categoriaId + ')'
    });

    if (this.productoEditando()) {
      const productoEditar = this.productoEditando()!;
      this.api.patchBebida(productoEditar.id, dataToSend).subscribe({
        next: (res) => {
          console.log('✅ Producto actualizado:', res);
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
          console.error('❌ Error actualizando bebida:', err);
          this.mostrarToast('Error al actualizar el producto', 'danger');
        }
      });
    } else {
      this.api.postBebida(dataToSend).subscribe({
        next: (created: any) => {
          console.log('✅ Producto creado exitosamente:', created);
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
          console.error('❌ Error creando bebida:', err);
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
