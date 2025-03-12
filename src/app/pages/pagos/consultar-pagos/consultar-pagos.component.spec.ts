import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarPagosComponent } from './consultar-pagos.component';

describe('ConsultarPagosComponent', () => {
  let component: ConsultarPagosComponent;
  let fixture: ComponentFixture<ConsultarPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarPagosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
