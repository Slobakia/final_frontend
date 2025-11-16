import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoComponent } from './listado';
import { RestauranteService } from '../../services/restaurante.service';
import { Router } from '@angular/router';

describe('ListadoComponent', () => {
  let component: ListadoComponent;
  let fixture: ComponentFixture<ListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListadoComponent],
      providers: [
        { provide: RestauranteService, useValue: { getAll: () => [] } },
        { provide: Router, useValue: {} }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create list component', () => {
    expect(component).toBeTruthy();
  });
});
