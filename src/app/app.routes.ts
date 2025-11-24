import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'reportes',
    loadComponent: () => import('./pages/reportes/reportes.module').then( m => m.ReportesPage)
  },

];
