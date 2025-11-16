import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ZonaService } from '../../services/zona.service';
import { Zona } from '../../models/zona';

@Component({
  selector: 'app-zona-formulario',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './formulario.html',
  styleUrls: ['./formulario.css']
})
export class FormularioComponent {

  id: string | null = null;
  restauranteId: string = '';

  nombre: string = '';
  horariosTexto: string = ''; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private zonaService: ZonaService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.restauranteId = this.route.snapshot.paramMap.get('restauranteId') || '';

    if (this.id) {
      const zona = this.zonaService.getById(this.id);
      if (zona) {
        this.nombre = zona.nombre;
        this.restauranteId = zona.restauranteId;
        this.horariosTexto = zona.horarios.join(', ');
      }
    }
  }

  guardar() {
    const horarios = this.horariosTexto
      .split(',')
      .map(h => h.trim())
      .filter(h => h.length > 0);

    if (this.id) {
      this.zonaService.update(this.id, {
        nombre: this.nombre,
        horarios
      });
    } else {
      this.zonaService.create({
        nombre: this.nombre,
        restauranteId: this.restauranteId,
        horarios
      });
    }

    this.router.navigate(['/zonas'], {
      queryParams: { restauranteId: this.restauranteId }
    });
  }

  cancelar() {
    this.router.navigate(['/zonas'], {
      queryParams: { restauranteId: this.restauranteId }
    });
  }
}
