import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosLayoutComponent } from './pagos-layout.component';

describe('PagosLayoutComponent', () => {
  let component: PagosLayoutComponent;
  let fixture: ComponentFixture<PagosLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagosLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagosLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
