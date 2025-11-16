import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MesaRoutingModule } from './mesas-routing.module';
import { ListadoComponent } from './listado/listado';
import { FormularioComponent } from './formulario/formulario';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ListadoComponent,
    FormularioComponent,
    MesaRoutingModule
  ]
})
export class MesaModule {}
