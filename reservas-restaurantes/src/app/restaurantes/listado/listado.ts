import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';
import { Restaurante } from '../../models/restaurante';

@Component({
  selector: 'app-restaurantes-listado',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './listado.html',
  styleUrls: ['./listado.css']
})
export class ListadoComponent {

  // Lista completa (sin filtrar) y lista mostrada en la UI
  restaurantesAll: Restaurante[] = [];
  restaurantes: Restaurante[] = [];

  // propiedad vinculada al input de búsqueda
  searchTerm: string = '';

  constructor(
    private service: RestauranteService,
    private router: Router
  ) {
    this.cargar();
  }

  cargar() {
    this.restaurantesAll = this.service.getAll();
    this.aplicarFiltros();
  }

  nuevo() {
    this.router.navigate(['/restaurantes/nuevo']);
  }

  editar(id: string) {
    this.router.navigate(['/restaurantes/editar', id]);
  }

  eliminar(id: string) {
    this.service.delete(id);
    this.cargar();
  }

  atras() {
    this.router.navigate(['']);
  }

  aplicarFiltros() {
    const term = (this.searchTerm || '').trim().toLowerCase();
    if (!term) {
      this.restaurantes = [...this.restaurantesAll];
      return;
    }
    this.restaurantes = this.restaurantesAll.filter(r => {
      const nombre = (r.nombre || '').toLowerCase();
      return nombre.includes(term);
    });
  }
}
