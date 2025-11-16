import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FormularioComponent } from './formulario';
import { ZonaService } from '../../services/zona.service';
import { Router, ActivatedRoute } from '@angular/router';

describe('FormularioComponent', () => {
  let component: FormularioComponent;
  let fixture: ComponentFixture<FormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioComponent],
      imports: [FormsModule],
      providers: [
        { provide: ZonaService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
