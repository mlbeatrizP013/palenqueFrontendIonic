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
  IonText,
  IonFab,
  IonFabButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash, people, arrowBack, time, calendar, ellipsisVertical } from 'ionicons/icons';
import { Asistente, Experiencia } from '../../interfaces/tipos';
import { ServiceAPI } from 'src/app/services/service-api';

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
    IonText,
    IonFab,
    IonFabButton
  ]
})
export class ExperienciaComponent {
  private fb = inject(FormBuilder);
  private api = inject(ServiceAPI);
  private apiUsuario = inject(ServiceAPI);

  // Input signals
  experiencias = input.required<Experiencia[]>();
  asistentes = input.required<Asistente[]>();
  listaCatas = signal<any[]>([]);

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
    descripcion: [''],
    capacidad: [null, [Validators.required]],
    costo: [null, [Validators.required]]
  });

  // Alerts / feedback
  resultAlertOpen = signal(false);
  resultAlertHeader = signal('');
  resultAlertMessage = signal('');
  lastOperationSuccess = signal(false);
  resultAlertButtons = [ { text: 'OK', role: 'cancel' } ];

  constructor() {
    addIcons({ add, create, trash, people, arrowBack, time, calendar, ellipsisVertical });
        this.api.findAll().subscribe({
      next: (res) => {
        console.log('Datos recibidos:', res);
        this.listaCatas.set(res);   
      },
      error: (err) => console.error('Error al obtener datos:', err)
    });
    this.apiUsuario.getUsuarios().subscribe({
      next: (res) => console.log('✅ Usuarios recibidos:', res),
      error: (err) => console.error('❌ Error al obtener usuarios:', err),
    });
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
        nombre: (exp as any).nombre ?? (exp as any).name,
        fecha: (exp as any).fecha ?? (exp as any).date,
        hora: (exp as any).hora ?? (exp as any).time,
        descripcion: (exp as any).descripcion ?? (exp as any).description,
        capacidad: (exp as any).capacidad ?? (exp as any).capacity ?? null,
        costo: (exp as any).costo ?? (exp as any).cost ?? null
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

    const formValue = this.experienciaForm.value as any;

    // Mapear campos del formulario al formato que espera la API
    // Construir fecha ISO si se proporcionó fecha y hora
    let fechaISO: string | null = null;
    try {
      if (formValue.fecha && formValue.hora) {
        fechaISO = new Date(`${formValue.fecha}T${formValue.hora}`).toISOString();
      } else if (formValue.fecha) {
        fechaISO = new Date(formValue.fecha).toISOString();
      }
    } catch (e) {
      fechaISO = formValue.fecha ?? null;
    }

    const payload: any = {
      name: formValue.nombre ?? formValue.name,
      description: formValue.descripcion ?? formValue.description,
      fecha: fechaISO,
      capacidad: Number(formValue.capacidad) ?? null,
      costo: Number(formValue.costo) ?? null,
      estado: true
    };

    if (this.isEditMode()) {
      // Actualizar en la API usando PATCH
      const id = this.selectedExperienciaId()!;
      this.api.patchExperiencia(id, payload).subscribe({
        next: (res) => {
          console.log('Experiencia actualizada:', res);
          // Reemplazar en la lista local
          this.listaCatas.update(list => list.map((item: any) => item.id === id ? res : item));
          this.resultAlertHeader.set('Éxito');
          this.resultAlertMessage.set('Experiencia actualizada correctamente');
          this.lastOperationSuccess.set(true);
          this.resultAlertOpen.set(true);
        },
        error: (err) => {
          console.error('Error al actualizar experiencia:', err);
          this.resultAlertHeader.set('Error');
          this.resultAlertMessage.set(err?.message ?? 'No se pudo actualizar la experiencia');
          this.lastOperationSuccess.set(false);
          this.resultAlertOpen.set(true);
        }
      });
    } else {
      // Crear nueva experiencia usando la API
      this.api.postExperiencia(payload).subscribe({
        next: (res) => {
          console.log('Experiencia creada:', res);
          // Añadir la nueva experiencia al principio de la lista local
          this.listaCatas.update(list => [res, ...list]);
          // Mostrar alerta de éxito y navegar al cerrar
          this.resultAlertHeader.set('Éxito');
          this.resultAlertMessage.set('Experiencia creada correctamente');
          this.lastOperationSuccess.set(true);
          this.resultAlertOpen.set(true);
        },
        error: (err) => {
          console.error('Error al crear experiencia:', err);
          this.resultAlertHeader.set('Error');
          this.resultAlertMessage.set(err?.message ?? 'No se pudo crear la experiencia');
          this.lastOperationSuccess.set(false);
          this.resultAlertOpen.set(true);
        }
      });
    }
  }

  onResultAlertDismiss(): void {
    this.resultAlertOpen.set(false);
    if (this.lastOperationSuccess()) {
      this.navegarALista();
    }
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
