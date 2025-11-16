import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import {
  IonContent,
  IonImg,
  IonButton,
  IonIcon,
  IonLabel,
  IonItem,
  IonTextarea,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { flaskOutline, leafOutline } from 'ionicons/icons';

// 1. IMPORTA TU HEADER COMPONENT
// Asegúrate que la ruta sea correcta.
import { HeaderComponent } from '../components/header/header.component';
import { HttpClient } from '@angular/common/http';

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
  ],
})
export class Tab3Page { 
  isEditing = false;

  vision = 'Lorem ipsum dolor sit amet...';
  maestro = 'Nombre del Maestro';
  mision = 'Lorem ipsum dolor sit amet...';
  valores = 'Lorem ipsum dolor sit amet...';
  normas = 'Descripción de las normas...';
  informacion = 'Información del lugar y ubicación...';

 constructor(private http: HttpClient) {
    addIcons({ flaskOutline, leafOutline });

    // PRUEBA DE CONEXIÓN EN CONSOLA
    console.log(
      '--- Intentando conectar con http://localhost:3000/info-home/findAll ---'
    );

    this.http.get('http://localhost:3000/info-home/findAll').subscribe({
      next: (res) => {
        console.log('✅ CONEXIÓN EXITOSA (info-home):', res);
      },
      error: (err) => {
        console.error('❌ ERROR DE CONEXIÓN (info-home):', err);
      },
    });
  }

  toggleEditMode(): void {
    this.isEditing = true;
  }

  guardarCambios(): void {
    this.isEditing = false;
    
    console.log('Datos guardados:', {
      vision: this.vision,
      maestro: this.maestro,
      mision: this.mision,
      valores: this.valores,
      normas: this.normas,
      informacion: this.informacion,
      //descripcion
      //
    });
  }
}