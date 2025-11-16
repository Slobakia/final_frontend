import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Restaurante } from '../models/restaurante';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class RestauranteService {

  private KEY = 'restaurantes';

  constructor(private storage: StorageService) {}

  // Obtener todos los restaurantes
  getAll(): Restaurante[] {
    return this.storage.getItem<Restaurante[]>(this.KEY) || [];
  }

  // Obtener restaurante por su ID
  getById(id: string): Restaurante | undefined {
    return this.getAll().find(r => r.id === id);
  }

  // Crear restaurante
  create(nombre: string): Restaurante {
    const lista = this.getAll();

    const nuevo: Restaurante = {
      id: uuidv4(),
      nombre
    };

    lista.push(nuevo);
    this.storage.setItem(this.KEY, lista);

    return nuevo;
  }

  // Editar restaurante
  update(id: string, nombre: string): boolean {
    const lista = this.getAll();
    const index = lista.findIndex(r => r.id === id);

    if (index === -1) return false;

    lista[index].nombre = nombre;
    this.storage.setItem(this.KEY, lista);

    return true;
  }

  // Eliminar restaurante
  delete(id: string): boolean {
    const lista = this.getAll();
    const nuevaLista = lista.filter(r => r.id !== id);

    if (nuevaLista.length === lista.length) return false;

    this.storage.setItem(this.KEY, nuevaLista);
    return true;
  }
}
