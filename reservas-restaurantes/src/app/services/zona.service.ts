import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Zona } from '../models/zona';

@Injectable({ providedIn: 'root' })
export class ZonaService {

  private KEY = 'zonas';

  constructor(private storage: StorageService) {}

  getAll(): Zona[] {
    return this.storage.getItem<Zona[]>(this.KEY) || [];
  }

  getById(id: string): Zona | undefined {
    return this.getAll().find(z => z.id === id);
  }

  getByRestaurante(restauranteId: string): Zona[] {
    return this.getAll().filter(z => z.restauranteId === restauranteId);
  }

  create(zona: Omit<Zona, 'id'>): Zona {
    const lista = this.getAll();

    const nueva: Zona = {
      id: crypto.randomUUID(),
      ...zona
    };

    lista.push(nueva);
    this.storage.setItem(this.KEY, lista);

    return nueva;
  }

  update(id: string, zona: Partial<Omit<Zona, 'id'>>): boolean {
    const lista = this.getAll();
    const index = lista.findIndex(z => z.id === id);

    if (index === -1) return false;

    lista[index] = { ...lista[index], ...zona };
    this.storage.setItem(this.KEY, lista);

    return true;
  }

  delete(id: string): boolean {
    const lista = this.getAll();
    const nuevaLista = lista.filter(z => z.id !== id);

    if (nuevaLista.length === lista.length) return false;

    this.storage.setItem(this.KEY, nuevaLista);
    return true;
  }
}
