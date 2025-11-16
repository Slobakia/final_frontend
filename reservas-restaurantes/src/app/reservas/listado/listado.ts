import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReservaService } from '../../services/reserva.service';
import { RestauranteService } from '../../services/restaurante.service';
import { ZonaService } from '../../services/zona.service';
import { MesaService } from '../../services/mesa.service';

import { Reserva } from '../../models/reserva';
import { Restaurante } from '../../models/restaurante';
import { Zona } from '../../models/zona';

@Component({
  selector: 'app-reserva-listado',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './listado.html',
  styleUrls: ['./listado.css']
})
export class ListadoComponent {

  reservas: Reserva[] = [];
  mostradas: Reserva[] = [];

  restaurantes: Restaurante[] = [];
  zonas: Zona[] = [];

  filtroRestaurante: string = '';
  filtroZona: string = '';
  filtroFecha: string = '';

  constructor(
    private reservaService: ReservaService,
    private restauranteService: RestauranteService,
    private zonaService: ZonaService,
    private mesaService: MesaService,
    private router: Router
  ) {
    this.restaurantes = this.restauranteService.getAll();
    this.cargarZonas();
    this.cargar();
  }

  cargarZonas() {
    if (this.filtroRestaurante) {
      this.zonas = this.zonaService.getByRestaurante(this.filtroRestaurante);
    } else {
      this.zonas = this.zonaService.getAll();
    }
    // si zona actual no pertenece al restaurante, limpiar
    if (this.filtroZona && !this.zonas.find(z => z.id === this.filtroZona)) {
      this.filtroZona = '';
    }
    this.aplicarFiltros();
  }

  cargar() {
    this.reservas = this.reservaService.getAll();
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.mostradas = this.reservas.filter(r => {
      if (this.filtroRestaurante && r.restauranteId !== this.filtroRestaurante) return false;
      if (this.filtroZona && r.zonaId !== this.filtroZona) return false;
      if (this.filtroFecha && r.fecha !== this.filtroFecha) return false;
      return true;
    });
  }

  onChangeRestaurante() {
    this.cargarZonas();
  }

  onChangeZona() {
    this.aplicarFiltros();
  }

  onChangeFecha() {
    this.aplicarFiltros();
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

  editar(id: string) {
    this.router.navigate(['/reservas/editar', id]);
  }

  eliminar(id: string) {
    this.reservaService.delete(id);
    this.cargar();
  }
}
