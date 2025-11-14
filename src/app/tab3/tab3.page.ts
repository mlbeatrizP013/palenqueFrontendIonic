import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonTextarea,
  IonLabel,
  IonButton,
  IonImg,
  IonInput,
  IonItem, // Para los campos del formulario
  IonIcon
} from '@ionic/angular/standalone';

import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
   
    HeaderComponent,

    IonContent,
    CommonModule,
    FormsModule,
    IonTextarea,
    IonLabel,
    IonButton,
    IonImg,
    IonItem,
    IonInput,
    IonItem, 
    IonIcon

  ],
})
export class Tab3Page {
  // Propiedades para enlazar los datos del formulario
  vision: string = "Describe la visión de la empresa"; 
  maestro: string = "Introduce el nombre del maestro"; 
  mision: string = "Describe la misión y valores";
  normas: string = "Describe las normas de producción"; 
  valores: string = "Describe las normas de producción"; 

  constructor() {}

  guardarCambios() {
    console.log('Visión:', this.vision);
    console.log('Maestro Mezcalero:', this.maestro);
    console.log('Misión:', this.mision);
    console.log('Normas:', this.normas);
    console.log('valores:', this.normas);
    // Aquí iría tu lógica para guardar los datos en tu backend
  }
  }
