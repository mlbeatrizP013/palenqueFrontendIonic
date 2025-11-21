import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'post-detail/:id',
    loadChildren: () => import('./post-detail/post-detail.page').then( m => m.PostDetailPage),
  },
];
