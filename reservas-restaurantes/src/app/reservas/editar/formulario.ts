import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ReservaService } from '../../services/reserva.service';
import { RestauranteService } from '../../services/restaurante.service';
import { ZonaService } from '../../services/zona.service';
import { MesaService } from '../../services/mesa.service';

@Component({
  selector: 'app-reserva-editar-formulario',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './formulario.html',
  styleUrls: ['./formulario.css']
})
export class FormularioComponent {
  id: string | null = null;

  restaurantes: any[] = [];
  zonas: any[] = [];
  mesas: any[] = [];

  restauranteId: string = '';
  zonaId: string = '';
  mesaId: string = '';

  fecha: string = '';
  hora: string = '';
  cantidadPersonas: number = 1;

  nombreCliente: string = '';
  apellidoCliente: string = '';
  telefono: string = '';

  submitted: boolean = false;
  touchedNombre: boolean = false;
  touchedRestaurante: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservaService: ReservaService,
    private restauranteService: RestauranteService,
    private zonaService: ZonaService,
    private mesaService: MesaService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.restaurantes = this.restauranteService.getAll();

    if (this.id) {
      const r = this.reservaService.getById(this.id);
      if (r) {
        this.restauranteId = r.restauranteId;
        this.zonaId = r.zonaId;
        this.mesaId = r.mesaId || '';
        this.fecha = r.fecha;
        this.hora = r.hora;
        this.cantidadPersonas = r.cantidadPersonas || 1;
        this.nombreCliente = r.nombreCliente || '';
        this.apellidoCliente = r.apellidoCliente || '';
        this.telefono = r.telefono || '';
      }
    }

    if (this.restauranteId) {
      this.cargarZonas();
    }
    if (this.zonaId) {
      this.cargarMesas();
    }
  }

  cargarZonas() {
    if (!this.restauranteId) {
      this.zonas = [];
      return;
    }
    this.zonas = this.zonaService.getByRestaurante(this.restauranteId);
  }

  cargarMesas() {
    if (!this.zonaId) {
      this.mesas = [];
      return;
    }
    this.mesas = this.mesaService.getByZona(this.zonaId);
  }

  guardar() {
    this.submitted = true;

    if (!this.restauranteId || !this.zonaId || !this.fecha || !this.hora || !this.nombreCliente || !this.apellidoCliente) {
      return;
    }

    const payload = {
      fecha: this.fecha,
      hora: this.hora,
      cantidadPersonas: this.cantidadPersonas,
      restauranteId: this.restauranteId,
      zonaId: this.zonaId,
      mesaId: this.mesaId,
      nombreCliente: this.nombreCliente,
      apellidoCliente: this.apellidoCliente,
      telefono: this.telefono
    };

    if (this.id) {
      this.reservaService.update(this.id, payload);
    } else {
      this.reservaService.create(payload as any);
    }

    this.router.navigate(['/reservas']);
  }

  cancelar() {
    this.router.navigate(['/reservas']);
  }

  atras() {
    this.router.navigate(['/reservas']);
  }
}
