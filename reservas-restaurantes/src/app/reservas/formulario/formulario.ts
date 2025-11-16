import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RestauranteService } from '../../services/restaurante.service';
import { ZonaService } from '../../services/zona.service';
import { MesaService } from '../../services/mesa.service';
import { ReservaService } from '../../services/reserva.service';
import { DisponibilidadService } from '../../services/disponibilidad.service';

import { Restaurante } from '../../models/restaurante';
import { Zona } from '../../models/zona';
import { Mesa } from '../../models/mesa';

@Component({
  selector: 'app-reserva-formulario',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './formulario.html',
  styleUrls: ['./formulario.css']
})
export class FormularioComponent {

  restaurantes: Restaurante[] = [];
  zonas: Zona[] = [];

  restauranteId: string = '';
  zonaId: string = '';
  fecha: string = '';
  hora: string = '';
  cantidadPersonas: number = 1;

  horariosZona: string[] = [];

  nombreCliente: string = '';
  apellidoCliente: string = '';
  telefono: string = '';

  mensajeError: string = '';

  constructor(
    private restauranteService: RestauranteService,
    private zonaService: ZonaService,
    private mesaService: MesaService,
    private reservaService: ReservaService,
    private disponibilidadService: DisponibilidadService,
    private router: Router
  ) {
    this.restaurantes = this.restauranteService.getAll();
  }

  cargarZonas() {
    this.zonas = this.zonaService.getByRestaurante(this.restauranteId);
  }

  cargarHorarios() {
    const zona = this.zonaService.getById(this.zonaId);
    this.horariosZona = zona ? zona.horarios : [];
  }

  confirmar() {
    const mesas = this.mesaService.getAll();
    const reservas = this.reservaService.getAll();

    const mesa = this.disponibilidadService.asignarMesa(
      mesas,
      reservas,
      this.zonaId,
      this.fecha,
      this.hora,
      this.cantidadPersonas
    );

    if (!mesa) {
      this.mensajeError = 'No hay mesas disponibles para ese horario.';
      return;
    }

    this.reservaService.create({
      fecha: this.fecha,
      hora: this.hora,
      cantidadPersonas: this.cantidadPersonas,
      nombreCliente: this.nombreCliente,
      apellidoCliente: this.apellidoCliente,
      telefono: this.telefono,
      mesaId: mesa.id,
      zonaId: this.zonaId,
      restauranteId: this.restauranteId
    });

    this.router.navigate(['/reservas']);
  }
}
