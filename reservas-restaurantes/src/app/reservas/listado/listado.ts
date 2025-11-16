import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReservaService } from '../../services/reserva.service';
import { RestauranteService } from '../../services/restaurante.service';
import { ZonaService } from '../../services/zona.service';
import { MesaService } from '../../services/mesa.service';

import { Reserva } from '../../models/reserva';

@Component({
  selector: 'app-reserva-listado',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './listado.html',
  styleUrls: ['./listado.css']
})
export class ListadoComponent {

  reservas: Reserva[] = [];

  constructor(
    private reservaService: ReservaService,
    private restauranteService: RestauranteService,
    private zonaService: ZonaService,
    private mesaService: MesaService,
    private router: Router
  ) {
    this.cargar();
  }

  cargar() {
    this.reservas = this.reservaService.getAll();
  }

  nuevo() {
    this.router.navigate(['/reservas/nuevo']);
  }

  obtenerNombreRestaurante(id: string) {
    return this.restauranteService.getById(id)?.nombre || '';
  }

  obtenerNombreZona(id: string) {
    return this.zonaService.getById(id)?.nombre || '';
  }

  obtenerMesa(id: string) {
    const mesa = this.mesaService.getById(id);
    return mesa ? `Mesa ${mesa.numero} (${mesa.capacidad} personas)` : '';
  }

  eliminar(id: string) {
    this.reservaService.delete(id);
    this.cargar();
  }
}
