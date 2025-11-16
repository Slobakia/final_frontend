import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Reserva } from '../models/reserva';

@Injectable({ providedIn: 'root' })
export class ReservaService {

  private KEY = 'reservas';

  constructor(private storage: StorageService) {}

  getAll(): Reserva[] {
    return this.storage.getItem<Reserva[]>(this.KEY) || [];
  }

  getById(id: string): Reserva | undefined {
    return this.getAll().find(r => r.id === id);
  }

  create(reserva: Omit<Reserva, 'id'>): Reserva {
    const lista = this.getAll();

    const nueva: Reserva = {
      id: crypto.randomUUID(),
      ...reserva
    };

    lista.push(nueva);
    this.storage.setItem(this.KEY, lista);

    return nueva;
  }

  update(id: string, datos: Partial<Omit<Reserva, 'id'>>): Reserva | null {
    const lista = this.getAll();
    const idx = lista.findIndex(r => r.id === id);
    if (idx === -1) return null;
    lista[idx] = { ...lista[idx], ...datos };
    this.storage.setItem(this.KEY, lista);
    return lista[idx];
  }

  delete(id: string): boolean {
    const lista = this.getAll();
    const nuevaLista = lista.filter(r => r.id !== id);

    if (nuevaLista.length === lista.length) return false;

    this.storage.setItem(this.KEY, nuevaLista);
    return true;
  }
}
