import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'analyze',
    loadComponent: () => import('./pages/analyze/analyze').then(m => m.Analyze)
  },
  {
    path: 'generate',
    loadComponent: () => import('./pages/generate/generate').then(m => m.Generate)
  },
  {
    path: 'history',
    loadComponent: () => import('./pages/history/history').then(m => m.History)
  },
  {
    path: 'inactive',
    loadComponent: () => import('./pages/inactive/inactive').then(m => m.Inactive)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
