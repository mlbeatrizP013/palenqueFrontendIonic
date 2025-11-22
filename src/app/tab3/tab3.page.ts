import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonImg,
  IonButton,
  IonIcon,
  IonLabel,
  IonItem,
  IonTextarea,
  IonInput,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  flaskOutline,
  leafOutline,
  createOutline, // Ícono para editar
  saveOutline, // Ícono para guardar
} from 'ionicons/icons';

import { HeaderComponent } from '../header/header.component';
import { ServiceAPI } from '../services/service-api';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonImg,
    IonButton,
    IonIcon,
    IonLabel,
    IonItem,
    IonTextarea,
    HeaderComponent,
    IonInput,
  ],
})
export class Tab3Page {
  // --- Propiedades para los datos ---
  vision: string = '';
  mision: string = '';
  valores: string = '';
  maestro: string = '';
  normasProduccion: string = '';
  historia: string = '';
  numeroContacto: string = '';
  ubicacion: string = '';
  private infoId: number | null = null;

  // --- Variables de estado individuales ---
  isEditingHistoria: boolean = false;
  isEditingVision: boolean = false;
  isEditingMaestro: boolean = false;
  isEditingMision: boolean = false;
  isEditingValores: boolean = false;
  isEditingNormas: boolean = false;
  isEditingUbicacion: boolean = false;
  isEditingContacto: boolean = false;

  constructor(private infoHomeService: ServiceAPI) {
    // --- Registra todos los íconos ---
    addIcons({ flaskOutline, leafOutline, createOutline, saveOutline });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.infoHomeService.findAllInfoHome().subscribe(
      (data) => {
        const info = Array.isArray(data) ? data[0] : data;
        if (!info) {
          console.error('No se recibió información del palenque.');
          return;
        }
        this.infoId = info.id;
        this.historia = info.historia;
        this.vision = info.vision;
        this.mision = info.mision;
        this.valores = info.valores;
        this.maestro = info.maestroMezcal;
        this.normasProduccion = info.normasProduccion;
        this.numeroContacto = info.numeroContacto;
        this.ubicacion = info.ubicacion;
      },
      (error) => {
        console.error('Error al cargar los datos:', error);
      }
    );
  }

  // --- Métodos de Toggle ---
  toggleEditHistoria() { this.isEditingHistoria = !this.isEditingHistoria; }
  toggleEditVision() { this.isEditingVision = !this.isEditingVision; }
  toggleEditMaestro() { this.isEditingMaestro = !this.isEditingMaestro; }
  toggleEditMision() { this.isEditingMision = !this.isEditingMision; }
  toggleEditValores() { this.isEditingValores = !this.isEditingValores; }
  toggleEditNormas() { this.isEditingNormas = !this.isEditingNormas; }
  toggleEditUbicacion() { this.isEditingUbicacion = !this.isEditingUbicacion; }
  toggleEditContacto() { this.isEditingContacto = !this.isEditingContacto; }

  // --- Métodos de Guardado ---

  // Función privada para revisar el ID
  private checkId(): boolean {
    if (this.infoId === null) {
      console.error('Error: No se ha cargado un ID para actualizar.');
      return false;
    }
    return true;
  }

  saveHistoria() {
    if (!this.checkId()) return;
    this.infoHomeService.patchInfoHome(this.infoId!, { historia: this.historia }).subscribe({
      next: (res) => { console.log('Historia actualizada', res); this.isEditingHistoria = false; },
      error: (err) => console.error('Error al guardar Historia:', err)
    });
  }

  saveVision() {
    if (!this.checkId()) return;
    this.infoHomeService.patchInfoHome(this.infoId!, { vision: this.vision }).subscribe({
      next: (res) => { console.log('Visión actualizada', res); this.isEditingVision = false; },
      error: (err) => console.error('Error al guardar Visión:', err)
    });
  }

  saveMaestro() {
    if (!this.checkId()) return;
    this.infoHomeService.patchInfoHome(this.infoId!, { maestroMezcal: this.maestro }).subscribe({
      next: (res) => { console.log('Maestro actualizado', res); this.isEditingMaestro = false; },
      error: (err) => console.error('Error al guardar Maestro:', err)
    });
  }

  saveMision() {
    if (!this.checkId()) return;
    this.infoHomeService.patchInfoHome(this.infoId!, { mision: this.mision }).subscribe({
      next: (res) => { console.log('Misión actualizada', res); this.isEditingMision = false; },
      error: (err) => console.error('Error al guardar Misión:', err)
    });
  }

  saveValores() {
    if (!this.checkId()) return;
    this.infoHomeService.patchInfoHome(this.infoId!, { valores: this.valores }).subscribe({
      next: (res) => { console.log('Valores actualizados', res); this.isEditingValores = false; },
      error: (err) => console.error('Error al guardar Valores:', err)
    });
  }

  saveNormas() {
    if (!this.checkId()) return;
    this.infoHomeService.patchInfoHome(this.infoId!, { normasProduccion: this.normasProduccion }).subscribe({
      next: (res) => { console.log('Normas actualizadas', res); this.isEditingNormas = false; },
      error: (err) => console.error('Error al guardar Normas:', err)
    });
  }

  saveUbicacion() {
    if (!this.checkId()) return;
    this.infoHomeService.patchInfoHome(this.infoId!, { ubicacion: this.ubicacion }).subscribe({
      next: (res) => { console.log('Ubicación actualizada', res); this.isEditingUbicacion = false; },
      error: (err) => console.error('Error al guardar Ubicación:', err)
    });
  }

  saveContacto() {
    if (!this.checkId()) return;
    this.infoHomeService.patchInfoHome(this.infoId!, { numeroContacto: +this.numeroContacto }).subscribe({
      next: (res) => { console.log('Contacto actualizado', res); this.isEditingContacto = false; },
      error: (err) => console.error('Error al guardar Contacto:', err)
    });
  }
}