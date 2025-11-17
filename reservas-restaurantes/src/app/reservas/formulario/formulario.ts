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
  pasoActual: number = 1;
  totalPasos: number = 5;

  restauranteId: string = '';
  zonaId: string = '';
  fecha: string = '';
  hora: string = '';
  cantidadPersonas: number = 1;
  nombreCliente: string = '';
  apellidoCliente: string = '';
  telefono: string = '';

  restaurantes: Restaurante[] = [];
  zonas: Zona[] = [];
  horariosDisponibles: string[] = [];

  fechaSeleccionada: Date = new Date();
  diasCalendario: any[] = [];
  mesActual: string = '';
  anioActual: string = '';
  diaSeleccionado: number = 0;
  mesIndex: number = 0;
  anio: number = 0;

  constructor(
    private restauranteService: RestauranteService,
    private zonaService: ZonaService,
    private mesaService: MesaService,
    private reservaService: ReservaService,
    private disponibilidadService: DisponibilidadService,
    private router: Router
  ) {
    this.restaurantes = this.restauranteService.getAll();
    const hoy = new Date();
    this.mesIndex = hoy.getMonth();
    this.anio = hoy.getFullYear();
    this.generarCalendario(this.mesIndex, this.anio);
  }

  siguientePaso() {
    if (this.pasoActual < this.totalPasos && this.validarPasoActual()) {
      this.pasoActual++;
      
      if (this.pasoActual === 2) {
        this.cargarZonas();
      } else if (this.pasoActual === 3) {
        this.cargarHorarios();
      }
    }
  }

  anteriorPaso() {
    if (this.pasoActual > 1) {
      this.pasoActual--;
    }
  }

  irAPaso(paso: number) {
    if (paso >= 1 && paso <= this.totalPasos) {
      this.pasoActual = paso;
    }
  }

  validarPasoActual(): boolean {
    switch (this.pasoActual) {
      case 1:
        return !!this.restauranteId;
      case 2:
        return !!this.zonaId;
      case 3:
        return !!this.fecha && !!this.hora;
      case 4:
        return this.cantidadPersonas > 0;
      case 5:
        return !!this.nombreCliente && !!this.apellidoCliente && !!this.telefono;
      default:
        return false;
    }
  }

  cargarZonas() {
    if (this.restauranteId) {
      this.zonas = this.zonaService.getByRestaurante(this.restauranteId);
    }
  }

  cargarHorarios() {
    if (this.zonaId) {
      const zona = this.zonaService.getById(this.zonaId);
      this.horariosDisponibles = zona ? zona.horarios : [];
    }
  }

  generarCalendario(month?: number, year?: number) {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const m = (typeof month === 'number') ? month : this.mesIndex;
    const y = (typeof year === 'number') ? year : this.anio;

    this.mesIndex = m;
    this.anio = y;
    this.mesActual = meses[m];
    this.anioActual = y.toString();

    const primerDia = new Date(y, m, 1);
    const ultimoDia = new Date(y, m + 1, 0);

    const offset = primerDia.getDay();

    const cells: Array<{ num: number | null; inactive?: boolean }> = [];
    for (let i = 0; i < offset; i++) {
      cells.push({ num: null, inactive: true });
    }

    for (let d = 1; d <= ultimoDia.getDate(); d++) {
      cells.push({ num: d, inactive: false });
    }

    while (cells.length % 7 !== 0) {
      cells.push({ num: null, inactive: true });
    }

    this.diasCalendario = cells;
  }

  cambiarMes(delta: number) {
    let nuevoMes = this.mesIndex + delta;
    let nuevoAnio = this.anio;
    while (nuevoMes < 0) {
      nuevoMes += 12;
      nuevoAnio -= 1;
    }
    while (nuevoMes > 11) {
      nuevoMes -= 12;
      nuevoAnio += 1;
    }
    this.generarCalendario(nuevoMes, nuevoAnio);
  }

  seleccionarFecha(dia: number) {
    const fecha = new Date();
    fecha.setDate(dia);
    this.fecha = fecha.toISOString().split('T')[0];
    this.diaSeleccionado = dia;
  }

  estaDiaSeleccionado(dia: number): boolean {
    return this.diaSeleccionado === dia;
  }

  disminuirCantidad() {
    this.cantidadPersonas = Math.max(1, this.cantidadPersonas - 1);
  }

  aumentarCantidad() {
    this.cantidadPersonas++;
  }

  seleccionarCantidadRapida(cantidad: number) {
    this.cantidadPersonas = cantidad;
  }

  confirmarReserva() {
    if (!this.validarPasoActual()) {
      return;
    }

    const mesas = this.mesaService.getAll();
    const reservas = this.reservaService.getAll();

    const mesa = this.disponibilidadService.asignarMesa(
      mesas, reservas, this.zonaId, this.fecha, this.hora, this.cantidadPersonas
    );

    if (!mesa) {
      alert('No hay mesas disponibles para ese horario.');
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

  getNombreRestaurante(): string {
    const restaurante = this.restaurantes.find(r => r.id === this.restauranteId);
    return restaurante ? restaurante.nombre : '';
  }

  getNombreZona(): string {
    const zona = this.zonas.find(z => z.id === this.zonaId);
    return zona ? zona.nombre : '';
  }

  getFechaFormateada(): string {
    if (!this.fecha) return '';
    const fechaObj = new Date(this.fecha);
    return `${fechaObj.getDate()}/${fechaObj.getMonth() + 1}/${fechaObj.getFullYear()}`;
  }

  atras(){
    this.router.navigate(['reservas']);
  }
}