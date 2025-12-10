import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, input, output, OnInit } from '@angular/core'; // Agregué OnInit aquí explícitamente
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
// Agregué el icono 'camera'
import { close, checkmark, images, arrowBack, save, camera } from 'ionicons/icons';
import { Producto } from '../../interfaces/productos';
import { ServiceAPI } from '../../services/service-api';
// IMPORTACIÓN DEL PLUGIN DE CÁMARA
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
export class ProductoFormularioComponent implements OnInit {
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
    // Agregué 'camera' a los iconos
    addIcons({ close, checkmark, images, arrowBack, save, camera });
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
    this.cargarCategorias();
  }

  // NUEVA FUNCIÓN PARA TOMAR FOTO
  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, // Esto devuelve Base64 (data:image/jpeg;base64,...)
        source: CameraSource.Prompt // Pregunta al usuario: ¿Cámara o Galería?
      });

      if (image.dataUrl) {
        // Asignamos el Base64 al campo del formulario
        this.productoForm.patchValue({
          imagen: image.dataUrl
        });
        // Marcamos el campo como 'touched' para que la validación visual funcione
        this.productoForm.get('imagen')?.markAsTouched();
      }
    } catch (error) {
      console.log('El usuario canceló la foto o hubo un error', error);
    }
  }

  private cargarCategorias(): void {
    this.api.findAllCategorias().subscribe({
      next: (res: any[]) => {
        if (Array.isArray(res) && res.length > 0) {
          this.categorias = res.map((c: any) => c.nombre ?? c.name ?? String(c));
          console.log('Categorías cargadas en formulario:', this.categorias);
        }
      },
      error: (err) => {
        console.warn('No se pudieron obtener categorías desde la API, usando valores por defecto', err);
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
}