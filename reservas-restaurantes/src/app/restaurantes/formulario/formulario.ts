import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestauranteService } from '../../services/restaurante.service';

@Component({
  selector: 'app-restaurante-formulario',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './formulario.html',
  styleUrls: ['./formulario.css']
})
export class FormularioComponent {

  id: string | null = null;
  nombre: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: RestauranteService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      const restaurante = this.service.getById(this.id);
      if (restaurante) this.nombre = restaurante.nombre;
    }
  }

  guardar() {
    if (!this.nombre.trim()) return;

    if (this.id) {
      this.service.update(this.id, this.nombre);
    } else {
      this.service.create(this.nombre);
    }

    this.router.navigate(['/restaurantes']);
  }

  cancelar() {
    this.router.navigate(['/restaurantes']);
  }
}
