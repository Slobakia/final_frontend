import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

  getItem<T>(key: string): T | null {
    if (!this.isBrowser) return null;
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : null;
  }

  setItem<T>(key: string, value: T): void {
    if (!this.isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(key);
  }
}
