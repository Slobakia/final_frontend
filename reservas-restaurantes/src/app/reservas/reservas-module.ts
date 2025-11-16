import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReservaRoutingModule } from './reservas-routing.module';
import { FormularioComponent } from './formulario/formulario';
import { ListadoComponent } from './listado/listado';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FormularioComponent,
    ListadoComponent,
    ReservaRoutingModule
  ]
})
export class ReservaModule {}
