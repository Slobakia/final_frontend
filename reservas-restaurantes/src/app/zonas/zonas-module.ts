import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ZonaRoutingModule } from './zonas-routing.module';
import { ListadoComponent } from './listado/listado';
import { FormularioComponent } from './formulario/formulario';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ListadoComponent,
    FormularioComponent,
    ZonaRoutingModule
  ]
})
export class ZonaModule {}
