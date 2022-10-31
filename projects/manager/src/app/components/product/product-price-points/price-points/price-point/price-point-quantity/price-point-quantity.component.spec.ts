import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePointQuantityComponent } from './price-point-quantity.component';

describe('PricePointQuantityComponent', () => {
  let component: PricePointQuantityComponent;
  let fixture: ComponentFixture<PricePointQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricePointQuantityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricePointQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
