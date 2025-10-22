import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-estado-user',
  templateUrl: './estado-user.page.html',
  styleUrls: ['./estado-user.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EstadoUserPage implements OnInit {
  experiencias = [
    { nombre: 'Cata de vinos', fecha: '2025-10-25', estado: 'pendiente' },
    { nombre: 'Cata artesanal', fecha: '2025-10-18', estado: 'aprobada' },
    { nombre: 'Cata gourmet', fecha: '2025-09-12', estado: 'rechazada' },
  ];
  constructor() { }

  ngOnInit() {
  }

}
