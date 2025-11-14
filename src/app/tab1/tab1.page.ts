import { Component, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExperienciaComponent } from '../pages/experiencia/experiencia.component';
import { AsistenciaComponent } from '../pages/asistencia/asistencia.component';
import { CommonModule } from '@angular/common';

import { Asistente, Experiencia } from '../interfaces/tipos';
import { experienciasIniciales, asistentesIniciales } from '../data/data-inicial';

import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    
    IonContent,
    ExperienciaComponent,
    AsistenciaComponent,
    HeaderComponent
  ],
})
export class Tab1Page {
  // Estado de la aplicación
  currentView = signal<'experiencias' | 'asistentes'>('experiencias');
  experienciaSeleccionada = signal<Experiencia | null>(null);
  
  // Datos de ejemplo
  experiencias = signal<Experiencia[]>(experienciasIniciales);

  asistentes = signal<Asistente[]>(asistentesIniciales);

  // Métodos de navegación
  verAsistentes(experienciaId: number): void {
    const experiencia = this.experiencias().find(e => e.id === experienciaId);
    if (experiencia) {
      this.experienciaSeleccionada.set(experiencia);
      this.currentView.set('asistentes');
    }
  }

  volverAExperiencias(): void {
    this.currentView.set('experiencias');
    this.experienciaSeleccionada.set(null);
  }

  // Métodos para experiencias
  guardarExperiencia(event: { experiencia: Omit<Experiencia, 'id' | 'creadoEn'>; id?: number }): void {
    const experiencias = this.experiencias();
    
    if (event.id) {
      // Actualizar experiencia existente
      const index = experiencias.findIndex(e => e.id === event.id);
      if (index !== -1) {
        experiencias[index] = {
          ...experiencias[index],
          ...event.experiencia
        };
        this.experiencias.set([...experiencias]);
      }
    } else {
      // Crear nueva experiencia
      const newExperiencia: Experiencia = {
        ...event.experiencia,
        id: Math.max(0, ...experiencias.map(e => e.id)) + 1,
        creadoEn: new Date()
      };
      this.experiencias.set([...experiencias, newExperiencia]);
    }
  }

  eliminarExperiencia(id: number): void {
    const experiencias = this.experiencias().filter(e => e.id !== id);
    this.experiencias.set(experiencias);
    // También eliminar asistentes asociados
    const asistentes = this.asistentes().filter(a => a.experienciaId !== id);
    this.asistentes.set(asistentes);
  }

  // Métodos para asistentes
  aprobarAsistente(asistente: Asistente): void {
    const asistentes = this.asistentes();
    const index = asistentes.findIndex(a => a.id === asistente.id);
    if (index !== -1) {
      asistentes[index] = {
        ...asistentes[index],
        estado: 'aprobada'
      };
      this.asistentes.set([...asistentes]);
    }
  }

  rechazarAsistente(asistente: Asistente): void {
    const asistentes = this.asistentes();
    const index = asistentes.findIndex(a => a.id === asistente.id);
    if (index !== -1) {
      asistentes[index] = {
        ...asistentes[index],
        estado: 'rechazada'
      };
      this.asistentes.set([...asistentes]);
    }
  }
}
