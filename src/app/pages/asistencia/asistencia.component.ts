import { ChangeDetectionStrategy, Component, computed, signal, inject, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonItem, 
  IonLabel, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonBadge,
  IonIcon,
  IonList,
  IonAlert,
  IonActionSheet,
  IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, person, mail, calendar, checkmark, close, people } from 'ionicons/icons';

import { Asistente, Experiencia } from '../../interfaces/tipos';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
  IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonActionSheet,
    IonAlert,
    IonBadge, 
    IonIcon,
    IonList,
    IonButtons
  ],
  providers: [DatePipe]
})
export class AsistenciaComponent {
  private fb = inject(FormBuilder);
  private datePipe = inject(DatePipe);

  // Input signals
  experiencias = input.required<Experiencia[]>();
  asistentes = input.required<Asistente[]>();
  experienciaEditando = input.required<Experiencia | null>();

  // Estado del componente
  selectedAsistente = signal<Asistente | null>(null);
  isActionSheetOpen = signal(false);
  isAprobarAlertOpen = signal(false);
  isRechazarAlertOpen = signal(false);

  // Computed properties
  asistentesParaExperiencia = computed(() => {
    const experiencia = this.experienciaEditando();
    if (!experiencia) return [];
    
    return this.asistentes().filter(a => a.experienciaId === experiencia.id);
  });

  getAsistentesAprobados(experienciaId: number) {
    return this.asistentes().filter(a => a.experienciaId === experienciaId && a.estado === 'aprobada');
  }

  getAsistentesPendientes(experienciaId: number) {
    return this.asistentes().filter(a => a.experienciaId === experienciaId && a.estado === 'pendiente');
  }

  // Output events
  aprobarAsistente = output<Asistente>();
  rechazarAsistente = output<Asistente>();
  volverGestion = output<void>();

  constructor() {
    addIcons({ arrowBack, person, mail, calendar, checkmark, close, people });
  }

  // Métodos del componente
  confirmarAprobar(asistente: Asistente): void {
    this.selectedAsistente.set(asistente);
    this.isAprobarAlertOpen.set(true);
  }

  confirmarRechazar(asistente: Asistente): void {
    this.selectedAsistente.set(asistente);
    this.isRechazarAlertOpen.set(true);
  }

  ejecutarAprobar(): void {
    const asistente = this.selectedAsistente();
    if (asistente) {
      this.aprobarAsistente.emit(asistente);
    }
    this.isAprobarAlertOpen.set(false);
    this.selectedAsistente.set(null);
  }

  ejecutarRechazar(): void {
    const asistente = this.selectedAsistente();
    if (asistente) {
      this.rechazarAsistente.emit(asistente);
    }
    this.isRechazarAlertOpen.set(false);
    this.selectedAsistente.set(null);
  }

  abrirAcciones(asistente: Asistente): void {
    this.selectedAsistente.set(asistente);
    this.isActionSheetOpen.set(true);
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'aprobada': return 'success';
      case 'pendiente': return 'warning';
      case 'rechazada': return 'danger';
      default: return 'medium';
    }
  }

  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'aprobada': return '✅ Aprobada';
      case 'pendiente': return '⏳ Pendiente';
      case 'rechazada': return '❌ Rechazada';
      default: return estado;
    }
  }

  formatFecha(fecha: Date): string {
    return this.datePipe.transform(fecha, 'shortDate') || '';
  }

  volver(): void {
    this.volverGestion.emit();
  }

  // Botones para el Action Sheet
  actionSheetButtons = [
    {
      text: '✅ Aprobar',
      role: 'aprobar',
      data: {
        action: 'aprobar'
      }
    },
    {
      text: '❌ Rechazar',
      role: 'rechazar',
      data: {
        action: 'rechazar'
      }
    },
    {
      text: 'Cancelar',
      role: 'cancel',
      data: {
        action: 'cancel'
      }
    }
  ];

  // Botones para las alertas
  alertButtons = [
    {
      text: 'No',
      role: 'cancel'
    },
    {
      text: 'Sí',
      role: 'confirm',
      handler: () => {
        if (this.isAprobarAlertOpen()) {
          this.ejecutarAprobar();
        } else if (this.isRechazarAlertOpen()) {
          this.ejecutarRechazar();
        }
      }
    }
  ];
}
