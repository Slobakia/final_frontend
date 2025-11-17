import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';
import { ZonaService } from '../../services/zona.service';
import { MesaService } from '../../services/mesa.service';

@Component({
  selector: 'app-mesa-formulario',
  templateUrl: './formulario.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
  styleUrls: ['./formulario.css']
})
export class FormularioComponent {

  id: string | null = null;
  zonaId: string = '';

  numero: string = '';
  capacidad: number = 1;
  restauranteId: string = '';

  restaurantes: any[] = [];
  zonas: any[] = [];
  zonasUnicas: any[] = [];
  submitted: boolean = false;
  touchedRestaurante: boolean = false;
  touchedZona: boolean = false;
  touchedNumero: boolean = false;
  touchedCapacidad: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MesaService,
    private restauranteService: RestauranteService,
    private zonaService: ZonaService,
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.zonaId = this.route.snapshot.queryParamMap.get('zonaId') || this.route.snapshot.paramMap.get('zonaId') || '';
    this.restaurantes = this.restauranteService.getAll();
    if (this.zonaId) {
      const zona = this.zonaService.getById(this.zonaId);
      if (zona) this.restauranteId = zona.restauranteId;
    }

    this.cargarZonas();

    if (this.id) {
      const mesa = this.service.getById(this.id);
      if (mesa) {
        this.numero = mesa.numero;
        this.capacidad = mesa.capacidad;
        this.zonaId = mesa.zonaId;
        const zona = this.zonaService.getById(mesa.zonaId);
        if (zona) this.restauranteId = zona.restauranteId;
        this.cargarZonas();
      }
    }
  }

  cargarZonas() {
    this.zonas = this.restauranteId ? this.zonaService.getByRestaurante(this.restauranteId) : this.zonaService.getAll();
    this.zonasUnicas = this.zonas.filter((z: any, i: number, arr: any[]) => arr.findIndex(x => x.nombre === z.nombre) === i);
  }

  guardar() {
    this.submitted = true;
    if (!(this.restauranteId && this.restauranteId.trim()) || !(this.zonaId && this.zonaId.trim()) || !(this.numero && this.numero.trim()) || !(this.capacidad && this.capacidad >= 1)) {
      return;
    }

    if (this.id) {
      this.service.update(this.id, {
        numero: this.numero,
        capacidad: this.capacidad
      });
    } else {
      this.service.create({
        numero: this.numero,
        capacidad: this.capacidad,
        zonaId: this.zonaId
      });
    }

    this.router.navigate(['/mesas']);
  }

  cancelar() {
    this.router.navigate(['/mesas'], {
      queryParams: { zonaId: this.zonaId }
    });
  }
}
