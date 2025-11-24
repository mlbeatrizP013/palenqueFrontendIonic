import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonButtons,
} from '@ionic/angular/standalone';

import { ReportesService, EstadisticaResumen } from '../../services/reportes.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonButtons,
  ],
})
export class ReportesPage implements OnInit {

  estadisticas: EstadisticaResumen[] = [];

  constructor(private reportesService: ReportesService) {}

  ngOnInit() {
    this.estadisticas = this.reportesService.obtenerEstadisticas();
  }

  getMaxValor(card: EstadisticaResumen): number {
    return Math.max(card.valorA, card.valorB, 1);
  }

  descargarUsuariosXls() {
    console.log('Descargando XLS simulado...');
  }
}
