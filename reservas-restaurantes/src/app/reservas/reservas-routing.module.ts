import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListadoComponent } from './listado/listado';
import { FormularioComponent as FormularioNuevoComponent } from './formulario/formulario';
import { FormularioComponent as FormularioEditarComponent } from './editar/formulario';

const routes: Routes = [
  { path: '', component: ListadoComponent },
  { path: 'nuevo', component: FormularioNuevoComponent },
  { path: 'editar/:id', component: FormularioEditarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservaRoutingModule {}
