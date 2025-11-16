import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Mesa } from '../models/mesa';

@Injectable({ providedIn: 'root' })
export class MesaService {

  private KEY = 'mesas';

  constructor(private storage: StorageService) {}

  getAll(): Mesa[] {
    return this.storage.getItem<Mesa[]>(this.KEY) || [];
  }

  getById(id: string): Mesa | undefined {
    return this.getAll().find(m => m.id === id);
  }

  getByZona(zonaId: string): Mesa[] {
    return this.getAll().filter(m => m.zonaId === zonaId);
  }

  create(mesa: Omit<Mesa, 'id'>): Mesa {
    const lista = this.getAll();

    const nueva: Mesa = {
      id: crypto.randomUUID(),
      ...mesa
    };

    lista.push(nueva);
    this.storage.setItem(this.KEY, lista);
    return nueva;
  }

  update(id: string, mesa: Partial<Omit<Mesa, 'id' | 'zonaId'>>): boolean {
    const lista = this.getAll();
    const index = lista.findIndex(m => m.id === id);

    if (index === -1) return false;

    lista[index] = { ...lista[index], ...mesa };
    this.storage.setItem(this.KEY, lista);

    return true;
  }

  delete(id: string): boolean {
    const lista = this.getAll();
    const nuevaLista = lista.filter(m => m.id !== id);

    if (lista.length === nuevaLista.length) return false;

    this.storage.setItem(this.KEY, nuevaLista);
    return true;
  }
}
