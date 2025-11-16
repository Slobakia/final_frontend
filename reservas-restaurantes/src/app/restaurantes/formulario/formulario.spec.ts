import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormularioComponent } from './formulario';
import { RestauranteService } from '../../services/restaurante.service';

describe('FormularioComponent', () => {
  let component: FormularioComponent;
  let fixture: ComponentFixture<FormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [FormularioComponent],
      providers: [
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } },
        { provide: RestauranteService, useValue: {} }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
