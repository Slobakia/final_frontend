import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MesaService } from '../../services/mesa.service';
import { Mesa } from '../../models/mesa';

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

  constructor(
    private service: MesaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.zonaId = this.route.snapshot.queryParamMap.get('zonaId') || '';
    this.cargar();
  }

  cargar() {
    if (this.zonaId) {
      this.mesas = this.service.getByZona(this.zonaId);
    } else {
      this.mesas = this.service.getAll();
    }
  }

  nueva() {
    this.router.navigate(['/mesas/nuevo', this.zonaId]);
  }

  editar(id: string) {
    this.router.navigate(['/mesas/editar', id]);
  }

  eliminar(id: string) {
    this.service.delete(id);
    this.cargar();
  }
}
