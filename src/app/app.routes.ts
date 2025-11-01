import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'pages',
    loadComponent: () => import('./pages/pages.page').then( m => m.PagesPage)
  },
  {
    path: 'pages',
    loadComponent: () => import('./pages/pages.page').then( m => m.PagesPage)
  },
  {
    path: 'form-exp',
    loadComponent: () => import('./pages/form-exp/form-exp.page').then( m => m.FormExpPage)
  },
  {
    path: 'form-exp',
    loadComponent: () => import('./pages/form-exp/form-exp.page').then( m => m.FormExpPage)
  },
  {
    path: 'estado-user',
    loadComponent: () => import('./pages/estado-user/estado-user.page').then( m => m.EstadoUserPage)
  },
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
];
