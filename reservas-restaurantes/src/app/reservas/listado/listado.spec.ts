import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoComponent } from './listado';
import { ReservaService } from '../../services/reserva.service';
import { RestauranteService } from '../../services/restaurante.service';
import { ZonaService } from '../../services/zona.service';
import { MesaService } from '../../services/mesa.service';

describe('ListadoComponent', () => {
  let component: ListadoComponent;
  let fixture: ComponentFixture<ListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListadoComponent],
      providers: [
        ReservaService,
        RestauranteService,
        ZonaService,
        MesaService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
