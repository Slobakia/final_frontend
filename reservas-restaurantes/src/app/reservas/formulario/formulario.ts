import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  id: string | null = null;

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
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.restaurantes = this.restauranteService.getAll();
    
    // para verificar si es edición
    this.id = this.route.snapshot.paramMap.get('id');

    // si vienen filtros por query params prellenar
    const qRest = this.route.snapshot.queryParamMap.get('restauranteId');
    const qZona = this.route.snapshot.queryParamMap.get('zonaId');
    const qFecha = this.route.snapshot.queryParamMap.get('fecha');

    if (qRest) this.restauranteId = qRest;
    if (qZona) this.zonaId = qZona;
    if (qFecha) this.fecha = qFecha;

    if (this.id) {
      const r = this.reservaService.getById(this.id);
      if (r) {
        this.restauranteId = r.restauranteId;
        this.zonaId = r.zonaId;
        this.fecha = r.fecha;
        this.hora = r.hora;
        this.cantidadPersonas = r.cantidadPersonas;
        this.nombreCliente = r.nombreCliente;
        this.apellidoCliente = r.apellidoCliente;
        this.telefono = r.telefono;
      }
    }

    this.cargarZonas();
    this.cargarHorarios();
  }

  cargarZonas() {
    this.zonas = this.zonaService.getByRestaurante(this.restauranteId);
  }

  cargarHorarios() {
    const zona = this.zonaService.getById(this.zonaId);
    this.horariosZona = zona ? zona.horarios : [];
  }

  confirmar() {
    this.mensajeError = '';

    // validaciones básicas
    if (!this.restauranteId || !this.zonaId || !this.fecha || !this.hora) {
      this.mensajeError = 'Complete restaurante, zona, fecha y hora.';
      return;
    }

    // obtener mesas y reservas actuales
    const mesas = this.mesaService.getAll();
    const reservas = this.reservaService.getAll();

    // si es creación
    if (!this.id) {
      const mesa = this.disponibilidadService.asignarMesa(
        mesas, reservas, this.zonaId, this.fecha, this.hora, this.cantidadPersonas
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

      this.router.navigate(['/reservas'], { queryParams: { restauranteId: this.restauranteId, zonaId: this.zonaId, fecha: this.fecha }});
      return;
    }

    // edición
    const reservaExistente = this.reservaService.getById(this.id!);
    if (!reservaExistente) {
      this.mensajeError = 'Reserva no encontrada.';
      return;
    }

    // Primero intentamos mantener la misma mesa si sigue válida:
    const mesaActual = this.mesaService.getById(reservaExistente.mesaId);
    let mesaAsignadaId = reservaExistente.mesaId;

    const mesaActualValida = mesaActual
      && mesaActual.zonaId === this.zonaId
      && mesaActual.capacidad >= this.cantidadPersonas
      && !reservas.some(r => r.id !== reservaExistente.id && r.mesaId === mesaActual.id && r.fecha === this.fecha && r.hora === this.hora);

    if (!mesaActualValida) {
      // buscar nueva mesa
      const nuevaMesa = this.disponibilidadService.asignarMesa(
        mesas, reservas.filter(r => r.id !== reservaExistente.id), // ignorar la reserva que editamos
        this.zonaId, this.fecha, this.hora, this.cantidadPersonas
      );

      if (!nuevaMesa) {
        this.mensajeError = 'No hay mesas disponibles para los cambios solicitados.';
        return;
      }
      mesaAsignadaId = nuevaMesa.id;
    }

    // actualizar reserva
    this.reservaService.update(this.id!, {
      fecha: this.fecha,
      hora: this.hora,
      cantidadPersonas: this.cantidadPersonas,
      nombreCliente: this.nombreCliente,
      apellidoCliente: this.apellidoCliente,
      telefono: this.telefono,
      mesaId: mesaAsignadaId,
      zonaId: this.zonaId,
      restauranteId: this.restauranteId
    });

    this.router.navigate(['/reservas'], { queryParams: { restauranteId: this.restauranteId, zonaId: this.zonaId, fecha: this.fecha }});
  }
}
