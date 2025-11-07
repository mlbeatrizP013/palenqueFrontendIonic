import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component, computed, signal, inject, input, output } from '@angular/core';
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
  IonInput,
  IonTextarea,
  IonGrid,
  IonRow,
  IonCol,
  IonActionSheet,
  IonAlert,
  IonIcon,
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { create, trash, people, arrowBack, time, calendar, ellipsisVertical } from 'ionicons/icons';
import { Asistente, Experiencia } from '../../interfaces/tipos';

@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.scss'],
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
    IonInput,
    IonTextarea,
    IonGrid,
    IonRow,
    IonCol,
    IonActionSheet,
    IonAlert,
    IonIcon,
    IonText
  ]
})
export class ExperienciaComponent {
  private fb = inject(FormBuilder);

  // Input signals
  experiencias = input.required<Experiencia[]>();
  asistentes = input.required<Asistente[]>();

  // Estado del componente
  currentView = signal<'list' | 'form'>('list');
  selectedExperienciaId = signal<number | null>(null);
  isActionSheetOpen = signal(false);
  isDeleteAlertOpen = signal(false);
  experienciaToDelete = signal<number | null>(null);

  // Formulario
  experienciaForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
    descripcion: ['']
  });

  constructor() {
    addIcons({ create, trash, people, arrowBack, time, calendar, ellipsisVertical });
  }

  // Computed properties
  isEditMode = computed(() => this.selectedExperienciaId() !== null);

  experienciaEditando = computed((): Experiencia | null => {
    const id = this.selectedExperienciaId();
    return id ? this.experiencias().find(exp => exp.id === id) || null : null;
  });

  // Output events
  guardarExperiencia = output<{ experiencia: Omit<Experiencia, 'id' | 'creadoEn'>; id?: number }>();
  eliminarExperiencia = output<number>();
  verAsistentes = output<number>();
  volverGestion = output<void>();

  // Métodos de navegación
  navegarALista(): void {
    this.currentView.set('list');
    this.selectedExperienciaId.set(null);
    this.experienciaForm.reset();
  }

  navegarAFormulario(): void {
    this.currentView.set('form');
    this.selectedExperienciaId.set(null);
    this.experienciaForm.reset();
  }

  navegarAEdicion(id: number): void {
    const exp = this.experiencias().find(e => e.id === id);
    if (exp) {
      this.experienciaForm.patchValue({
        nombre: exp.nombre,
        fecha: exp.fecha,
        hora: exp.hora,
        descripcion: exp.descripcion
      });
      this.selectedExperienciaId.set(id);
      this.currentView.set('form');
    }
  }

  // Métodos de ayuda
  getAsistentesPorExperiencia(experienciaId: number) {
    return this.asistentes().filter(a => a.experienciaId === experienciaId);
  }

  getAsistentesAprobados(experienciaId: number) {
    return this.getAsistentesPorExperiencia(experienciaId).filter(a => a.estado === 'aprobada');
  }

  // CRUD
  guardar(): void {
    if (!this.experienciaForm.valid) return;

    const formValue = this.experienciaForm.value as Omit<Experiencia, 'id' | 'creadoEn'>;

    if (this.isEditMode()) {
      this.guardarExperiencia.emit({ experiencia: formValue, id: this.selectedExperienciaId()! });
    } else {
      this.guardarExperiencia.emit({ experiencia: formValue });
    }

    this.navegarALista();
  }

  confirmarEliminar(id: number): void {
    this.experienciaToDelete.set(id);
    this.isDeleteAlertOpen.set(true);
  }

  eliminar(): void {
    const id = this.experienciaToDelete();
    if (id) {
      this.eliminarExperiencia.emit(id);
    }
    this.isDeleteAlertOpen.set(false);
    this.experienciaToDelete.set(null);
  }

  verAsistentesDeExperiencia(id: number): void {
    this.verAsistentes.emit(id);
  }

  volver(): void {
    this.volverGestion.emit();
  }

  abrirAcciones(experiencia: Experiencia): void {
    this.selectedExperienciaId.set(experiencia.id);
    this.isActionSheetOpen.set(true);
  }

  cerrarAcciones(): void {
    this.isActionSheetOpen.set(false);
    this.selectedExperienciaId.set(null);
  }

  // Botones para el Action Sheet
  actionSheetButtons = [
    { text: '✏️ Editar', data: { action: 'edit' } },
    { text: '👥 Asistentes', data: { action: 'attendees' } },
    { text: '🗑️ Eliminar', role: 'destructive', data: { action: 'delete' } },
    { text: 'Cancelar', role: 'cancel', data: { action: 'cancel' } }
  ];

  // Botones para las alertas
  alertButtons = [
    { text: 'No', role: 'cancel' },
    { text: 'Sí', role: 'confirm', handler: () => this.eliminar() }
  ];
}
