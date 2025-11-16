import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZonaService } from '../../services/zona.service';
import { Zona } from '../../models/zona';

@Component({
  selector: 'app-zona-listado',
  templateUrl: './listado.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
  styleUrls: ['./listado.css']
})
export class ListadoComponent {

  zonas: Zona[] = [];
  restauranteId: string = '';

  constructor(
    private zonaService: ZonaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.restauranteId = this.route.snapshot.queryParamMap.get('restauranteId') || '';
    this.cargar();
  }

  cargar() {
    if (this.restauranteId) {
      this.zonas = this.zonaService.getByRestaurante(this.restauranteId);
    } else {
      this.zonas = this.zonaService.getAll();
    }
  }

  nueva() {
    this.router.navigate([
      '/zonas/nuevo',
      this.restauranteId
    ]);
  }

  editar(id: string) {
    this.router.navigate(['/zonas/editar', id]);
  }

  eliminar(id: string) {
    this.zonaService.delete(id);
    this.cargar();
  }
}
