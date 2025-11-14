import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- AÑADIDO
import { FormsModule } from '@angular/forms'; // <-- AÑADIDO
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonTextarea,  // <-- AÑADIDO
  IonLabel,   // <-- AÑADIDO
  IonButton,  // <-- AÑADIDO
  IonImg      // <-- AÑADIDO
} from '@ionic/angular/standalone';
// import { ExploreContainerComponent } from '../explore-container/explore-container.component'; // <-- ELIMINADO

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true, // <-- AÑADIDO (tus imports lo confirman)
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    // ExploreContainerComponent, // <-- ELIMINADO
    CommonModule, // <-- AÑADIDO
    FormsModule,  // <-- AÑADIDO
    IonTextarea,  // <-- AÑADIDO
    IonLabel,   // <-- AÑADIDO
    IonButton,  // <-- AÑADIDO
    IonImg      // <-- AÑADIDO
  ],
})
export class Tab3Page {
  
  // Propiedades para enlazar los datos del formulario
  vision: string = "Nuestra visión es ser el principal referente en la producción de mezcal artesanal, destacando por nuestra calidad...";
  mision: string = "Preservar la tradición mezcalera de generaciones, ofreciendo un producto auténtico que refleje la riqueza de nuestra tierra...";
  procesos: string = "1. Selección de agave espadín maduro.\n2. Cocción en horno cónico de piedra.\n3. Molienda en tahona...";

  constructor() {}

  guardarCambios() {
    // Aquí iría tu lógica para guardar los datos en tu backend
    console.log("Visión:", this.vision);
    console.log("Misión:", this.mision);
    console.log("Procesos:", this.procesos);
  }
}