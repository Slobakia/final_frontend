import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MesaService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.zonaId = this.route.snapshot.paramMap.get('zonaId') || '';

    if (this.id) {
      const mesa = this.service.getById(this.id);
      if (mesa) {
        this.numero = mesa.numero;
        this.capacidad = mesa.capacidad;
        this.zonaId = mesa.zonaId;
      }
    }
  }

  guardar() {
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

    this.router.navigate(['/mesas'], {
      queryParams: { zonaId: this.zonaId }
    });
  }

  cancelar() {
    this.router.navigate(['/mesas'], {
      queryParams: { zonaId: this.zonaId }
    });
  }
}
