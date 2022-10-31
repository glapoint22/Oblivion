import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePointUnitPriceComponent } from './price-point-unit-price.component';

describe('PricePointUnitPriceComponent', () => {
  let component: PricePointUnitPriceComponent;
  let fixture: ComponentFixture<PricePointUnitPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricePointUnitPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricePointUnitPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
