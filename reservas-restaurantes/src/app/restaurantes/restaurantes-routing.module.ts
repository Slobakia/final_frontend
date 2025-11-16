import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListadoComponent } from './listado/listado';
import { FormularioComponent } from './formulario/formulario';

const routes: Routes = [
  { path: '', component: ListadoComponent },
  { path: 'nuevo', component: FormularioComponent },
  { path: 'editar/:id', component: FormularioComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestauranteRoutingModule {}
