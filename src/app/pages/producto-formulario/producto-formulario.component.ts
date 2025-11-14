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
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, checkmark, images, arrowBack, save } from 'ionicons/icons';
import { Producto } from '../../interfaces/productos';

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

  productoEditando = input<Producto | null>(null);
  guardarProducto = output<Omit<Producto, 'id' | 'fechaCreacion'>>();
  cancelar = output<void>();

  productoForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    categoria: ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.minLength(5)]],
    precioMXN: ['', [Validators.required, Validators.min(0)]],
    stockInicial: ['', [Validators.required, Validators.min(1)]],
    stockMinimo: ['', [Validators.required, Validators.min(0)]],
    imagen: ['', Validators.required]
  });

  categorias = ['Tequila', 'Mezcal', 'Raicilla', 'Bacanora', 'Pulque'];

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
}

