import { Injectable } from '@angular/core';
import { Mesa } from '../models/mesa';
import { Reserva } from '../models/reserva';

@Injectable({ providedIn: 'root' })
export class DisponibilidadService {

  /**
   * Servicio que nos devuelve la mejor mesa disponible:
   * - misma zona
   * - libre en fecha + hora
   * - capacidad >= cantidad de personas
   * - mesa con capacidad más justa 
   */
  asignarMesa(
    mesas: Mesa[],
    reservas: Reserva[],
    zonaId: string,
    fecha: string,
    hora: string,
    cantidadPersonas: number
  ): Mesa | null {

    const ocupadas = new Set(
      reservas
        .filter(r => r.zonaId === zonaId && r.fecha === fecha && r.hora === hora)
        .map(r => r.mesaId)
    );

    const disponibles = mesas
      .filter(m => 
        m.zonaId === zonaId &&
        m.capacidad >= cantidadPersonas &&
        !ocupadas.has(m.id)
      )
      .sort((a, b) => a.capacidad - b.capacidad);

    return disponibles.length ? disponibles[0] : null;
  }
}
