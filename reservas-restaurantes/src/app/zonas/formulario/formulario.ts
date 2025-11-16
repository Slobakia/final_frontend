import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ZonaService } from '../../services/zona.service';
import { RestauranteService } from '../../services/restaurante.service';
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
  horarios: string[] = [];
  horarioTemporal: string = '';
  restaurantes: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private zonaService: ZonaService,
    private restauranteService: RestauranteService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.restauranteId = this.route.snapshot.paramMap.get('restauranteId') || '';
    this.restaurantes = this.restauranteService.getAll();

    if (this.id) {
      const zona = this.zonaService.getById(this.id);
      if (zona) {
        this.nombre = zona.nombre;
        this.restauranteId = zona.restauranteId;
        this.horarios = [...zona.horarios];
      }
    }
  }

  agregarHorario() {
    if (!this.horarioTemporal) return;

    if (!this.horarios.includes(this.horarioTemporal)) {
      this.horarios.push(this.horarioTemporal);
      this.horarios.sort();
    }

    this.horarioTemporal = '';
  }

  eliminarHorario(h: string) {
    this.horarios = this.horarios.filter(x => x !== h);
  }

  guardar() {
    if (this.horarios.length === 0) {
      alert("Debe agregar al menos un horario.");
      return;
    }

    if (this.id) {
      this.zonaService.update(this.id, {
        nombre: this.nombre,
        horarios: [...this.horarios]
      });
    } else {
      this.zonaService.create({
        nombre: this.nombre,
        restauranteId: this.restauranteId,
        horarios: [...this.horarios]
      });
    }

    this.router.navigate(['/zonas']);
  }

  cancelar() {
    this.router.navigate(['/zonas']);
  }
}