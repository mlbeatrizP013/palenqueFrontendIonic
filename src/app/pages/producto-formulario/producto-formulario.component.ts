import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, input, output } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonSelect,
  IonSelectOption,
  IonIcon,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, checkmark, images, arrowBack, save } from 'ionicons/icons';
import { Producto } from '../../interfaces/productos';
import { ServiceAPI } from '../../services/service-api';

@Component({
  selector: 'app-producto-formulario',
  templateUrl: './producto-formulario.component.html',
  styleUrls: ['./producto-formulario.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonSelect,
    IonSelectOption,
    IonIcon
  ]
})
export class ProductoFormularioComponent {
  private fb = inject(FormBuilder);
  private api = inject(ServiceAPI);
  private toastController = inject(ToastController);

  productoEditando = input<Producto | null>(null);
  guardarProducto = output<Omit<Producto, 'id' | 'fechaCreacion'>>();
  cancelar = output<void>();

  productoForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    categoria: ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.minLength(5)]],
    precioMXN: ['', [Validators.required, Validators.min(1)]],
    stockInicial: ['', [Validators.required, Validators.min(1)]],
    stockMinimo: ['', [Validators.required, Validators.min(0)]],
    imagen: ['', Validators.required]
  });

  categorias: string[] = ['Tequila', 'Mezcal', 'Raicilla', 'Bacanora', 'Pulque'];

  constructor() {
    addIcons({ close, checkmark, images, arrowBack, save });
  }

  ngOnInit() {
    const producto = this.productoEditando();
    if (producto) {
      this.productoForm.patchValue({
        nombre: producto.nombre,
        categoria: producto.categoria,
        descripcion: producto.descripcion,
        precioMXN: producto.precioMXN.toString(),
        stockInicial: producto.stockInicial.toString(),
        stockMinimo: producto.stockMinimo.toString(),
        imagen: producto.imagen
      });
    }
    // Cargar categorías desde la API en tiempo real
    this.cargarCategorias();
  }

  private cargarCategorias(): void {
    // Cargar categorías desde la API (tabla categorias en BD)
    this.api.findAllCategorias().subscribe({
      next: (res: any[]) => {
        if (Array.isArray(res) && res.length > 0) {
          this.categorias = res.map((c: any) => c.nombre ?? c.name ?? String(c));
          console.log('Categorías cargadas en formulario:', this.categorias);
        }
      },
      error: (err) => {
        console.warn('No se pudieron obtener categorías desde la API, usando valores por defecto', err);
        // Mantener las categorías por defecto
      }
    });
  }

  guardar(): void {
    if (this.productoForm.valid) {
      const formValue = this.productoForm.value;
      this.guardarProducto.emit({
        nombre: formValue.nombre!,
        categoria: formValue.categoria!,
        descripcion: formValue.descripcion!,
        precioMXN: parseFloat(formValue.precioMXN as any),
        stockInicial: parseInt(formValue.stockInicial as any),
        stockActual: parseInt(formValue.stockInicial as any),
        stockMinimo: parseInt(formValue.stockMinimo as any),
        imagen: formValue.imagen!,
        estado: 'activo'
      });
      this.productoForm.reset();
    }
  }

  onCancelar(): void {
    this.cancelar.emit();
    this.productoForm.reset();
  }

  async mostrarToast(mensaje: string, color: 'success' | 'danger' = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
      color: color
    });
    await toast.present();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        this.mostrarToast('Por favor selecciona un archivo de imagen válido', 'danger');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.mostrarToast('La imagen no debe superar los 5MB', 'danger');
        return;
      }

      // Convertir a base64
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        this.productoForm.patchValue({ imagen: base64String });
        console.log('✅ Imagen convertida a base64, tamaño:', base64String.length, 'caracteres');
      };
      reader.onerror = (error) => {
        console.error('❌ Error al leer la imagen:', error);
        this.mostrarToast('Error al cargar la imagen', 'danger');
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}

