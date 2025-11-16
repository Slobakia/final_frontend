import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MesaService } from '../../services/mesa.service';
import { RestauranteService } from '../../services/restaurante.service';
import { ZonaService } from '../../services/zona.service';
import { Mesa } from '../../models/mesa';
import { Zona } from '../../models/zona';
import { Restaurante } from '../../models/restaurante';

@Component({
  selector: 'app-mesa-listado',
  templateUrl: './listado.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
  styleUrls: ['./listado.css']
})
export class ListadoComponent {

  mesas: Mesa[] = [];
  zonaId: string = '';
  restaurantes: Restaurante[] = [];
  zonas: Zona[] = [];

  filtroRestaurante: string = '';
  filtroZona: string = '';

  constructor(
    private service: MesaService,
    private zonaService: ZonaService,
    private restauranteService: RestauranteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.zonaId = this.route.snapshot.queryParamMap.get('zonaId') || '';
    this.restaurantes = this.restauranteService.getAll();
    this.cargarZonas();
    this.cargarMesas();
  }

   // cargar zonas según restaurante seleccionado
  cargarZonas() {
    if (this.filtroRestaurante) {
      this.zonas = this.zonaService.getByRestaurante(this.filtroRestaurante);
    } else {
      this.zonas = this.zonaService.getAll();
    }
    // si la zona seleccionada no pertenece al restaurante, limpiarla
    if (this.filtroZona && !this.zonas.find(z => z.id === this.filtroZona)) {
      this.filtroZona = '';
    }
    this.cargarMesas();
  }

  // cargar mesas según filtros activos
  cargarMesas() {
    if (this.filtroZona) {
      this.mesas = this.service.getByZona(this.filtroZona);
    } else if (this.filtroRestaurante) {
      // si hay restaurante pero no zona, juntamos todas las mesas de sus zonas
      const zonas = this.zonaService.getByRestaurante(this.filtroRestaurante);
      const ids = zonas.map(z => z.id);
      this.mesas = this.service.getAll().filter(m => ids.includes(m.zonaId));
    } else {
      this.mesas = this.service.getAll();
    }
  }

  onChangeRestaurante() {
    this.cargarZonas();
  }

  onChangeZona() {
    this.cargarMesas();
  }

  nueva() {
    this.router.navigate(['/mesas/nuevo'], { queryParams: { zonaId: this.filtroZona }});
  }

  obtenerZona(id: string) {
    return this.zonaService.getById(id)?.nombre || '';
  }

  obtenerRestauranteDesdeZona(zonaId: string) {
    const zona = this.zonaService.getById(zonaId);
    if (!zona) return '';
    return this.restauranteService.getById(zona.restauranteId)?.nombre || '';
  }

  editar(id: string) {
    this.router.navigate(['/mesas/editar', id]);
  }

  eliminar(id: string) {
    this.service.delete(id);
    this.cargarMesas();
  }
}
