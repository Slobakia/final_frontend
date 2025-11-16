import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'restaurantes',
    loadChildren: () =>
      import('./restaurantes/restaurantes-routing.module').then(m => m.RestauranteRoutingModule),
  },
  {
    path: 'zonas',
    loadChildren: () =>
      import('./zonas/zonas-routing.module').then(m => m.ZonaRoutingModule),
  },
  {
    path: 'mesas',
    loadChildren: () =>
      import('./mesas/mesas-routing.module').then(m => m.MesaRoutingModule),
  },
  {
    path: 'reservas',
    loadChildren: () =>
      import('./reservas/reservas-routing.module').then(m => m.ReservaRoutingModule),
  },
  { path: '', redirectTo: 'reservas', pathMatch: 'full' },
  { path: '**', redirectTo: 'reservas' }
];
