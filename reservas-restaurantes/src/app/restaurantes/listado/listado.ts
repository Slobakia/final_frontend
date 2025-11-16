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

  restaurantes: Restaurante[] = [];

  constructor(
    private service: RestauranteService,
    private router: Router
  ) {
    this.cargar();
  }

  cargar() {
    this.restaurantes = this.service.getAll();
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
}
