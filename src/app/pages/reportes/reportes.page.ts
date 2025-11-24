import { Component, OnInit } from '@angular/core';
import { ReportesService, EstadisticaResumen } from '../../services/reportes.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
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
    // Aquí luego se conectará a API/BD real
    console.log('Descargando lista de usuarios en XLS (simulado)');
  }
}
