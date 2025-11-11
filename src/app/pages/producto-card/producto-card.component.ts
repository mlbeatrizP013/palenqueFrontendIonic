import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonBadge,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { pencil, trash } from 'ionicons/icons';
import { Producto } from '../../interfaces/productos';

@Component({
  selector: 'app-producto-card',
  templateUrl: './producto-card.component.html',
  styleUrls: ['./producto-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonBadge,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonText
  ]
})
export class ProductoCardComponent {
  producto = input.required<Producto>();
  verDetalle = output<Producto>();
  editar = output<Producto>();
  eliminar = output<number>();

  constructor() {
    addIcons({ pencil, trash });
  }

  getStatusColor(): string {
    const estado = this.producto().estado;
    switch (estado) {
      case 'activo':
        return 'success';
      case 'stock_bajo':
        return 'warning';
      case 'sin_stock':
        return 'danger';
      case 'inactivo':
        return 'medium';
      default:
        return 'medium';
    }
  }

  getStatusLabel(): string {
    const estado = this.producto().estado;
    switch (estado) {
      case 'activo':
        return 'Activo';
      case 'stock_bajo':
        return 'Stock Bajo';
      case 'sin_stock':
        return 'Sin Stock';
      case 'inactivo':
        return 'Inactivo';
      default:
        return estado;
    }
  }

  onVerDetalle(): void {
    this.verDetalle.emit(this.producto());
  }

  onEditar(event: Event): void {
    event.stopPropagation();
    this.editar.emit(this.producto());
  }

  onEliminar(event: Event): void {
    event.stopPropagation();
    this.eliminar.emit(this.producto().id);
  }
}
