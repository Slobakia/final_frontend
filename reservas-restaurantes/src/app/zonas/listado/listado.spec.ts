import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoComponent } from './listado';
import { ZonaService } from '../../services/zona.service';
import { Router, ActivatedRoute } from '@angular/router';

describe('ListadoComponent', () => {
  let component: ListadoComponent;
  let fixture: ComponentFixture<ListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListadoComponent],
      providers: [
        { provide: ZonaService, useValue: { getAll: () => [] } },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: new Map() } } }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
