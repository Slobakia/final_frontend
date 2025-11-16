import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZonaService } from '../../services/zona.service';
import { RestauranteService } from '../../services/restaurante.service';
import { Zona } from '../../models/zona';
import { Restaurante } from '../../models/restaurante';


@Component({
  selector: 'app-zona-listado',
  templateUrl: './listado.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
  styleUrls: ['./listado.css']
})
export class ListadoComponent {

  zonas: Zona[] = [];
  restaurantes: Restaurante[] = [];
  restauranteId: string = '';
  filtroRestaurante: string = '';

  constructor(
    private zonaService: ZonaService,
    private route: ActivatedRoute,
    private restauranteService: RestauranteService,
    private router: Router
  ) {
    this.restauranteId = this.route.snapshot.queryParamMap.get('restauranteId') || '';
    this.restaurantes = this.restauranteService.getAll();
    this.cargar();
  }

  cargar() {
    if (this.filtroRestaurante) {
      this.zonas = this.zonaService.getByRestaurante(this.filtroRestaurante);
    } else {
      this.zonas = this.zonaService.getAll();
    }
  }

  onChangeRestaurante() {
    this.cargar();
  }

  nueva() {
    this.router.navigate(['/zonas/nuevo'], { queryParams: { restauranteId: this.filtroRestaurante }});
  }

  obtenerRestaurante(id: string) {
    return this.restauranteService.getById(id)?.nombre || '';
  }

  editar(id: string) {
    this.router.navigate(['/zonas/editar', id]);
  }

  eliminar(id: string) {
    this.zonaService.delete(id);
    this.cargar();
  }
}
