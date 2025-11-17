import { Injectable } from '@angular/core';
import { Mesa } from '../models/mesa';
import { Reserva } from '../models/reserva';

@Injectable({ providedIn: 'root' })
export class DisponibilidadService {
asignarMesa(
    mesas: Mesa[],
    reservas: Reserva[],
    zonaId: string,
    fecha: string,   
    hora: string,    
    cantidadPersonas: number
  ): Mesa | null {

    const f = this.normalizeDate(fecha);
    const h = this.normalizeTime(hora);

    const mesasPosibles = mesas
      .filter(m => m.zonaId === zonaId && (m.capacidad || 0) >= (cantidadPersonas || 1))
      .map(m => ({ ...m })); 
    if (!mesasPosibles.length) return null;

    const ocupadas = new Set<string>();
    for (const r of reservas) {
      const rf = this.normalizeDate(r.fecha);
      const rh = this.normalizeTime(r.hora);
      if (rf === f && rh === h && r.mesaId) {
        ocupadas.add(r.mesaId);
      }
    }
    
    const mesasLibres = mesasPosibles.filter(m => !ocupadas.has(m.id));
    const mesasOcupadas = mesasPosibles.filter(m => ocupadas.has(m.id));

    mesasLibres.sort((a, b) => {
      if ((a.capacidad || 0) !== (b.capacidad || 0)) return (a.capacidad || 0) - (b.capacidad || 0);
      return (a.id || '').localeCompare(b.id || '');
    });

    if (mesasLibres.length > 0) {
     
      const exact = mesasLibres.find(m => (m.capacidad || 0) === cantidadPersonas);
      if (exact) return exact;
      return mesasLibres[0];
    }

    return null;
  }

  normalizeTime(t: string): string {
    if (!t) return '';
    const parts = t.split(':').map(p => p.trim());
    if (parts.length === 1) return parts[0].padStart(2, '0') + ':00';
    const hh = parts[0].padStart(2, '0');
    const mm = (parts[1] || '00').padStart(2, '0');
    return `${hh}:${mm}`;
  }

  normalizeDate(d: string): string {
    if (!d) return '';
    const parts = d.split('-');
    if (parts.length === 3) {
      const yyyy = parts[0];
      const mm = parts[1].padStart(2, '0');
      const dd = parts[2].padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }

    const dateObj = new Date(d);
    if (isNaN(dateObj.getTime())) return d;
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
