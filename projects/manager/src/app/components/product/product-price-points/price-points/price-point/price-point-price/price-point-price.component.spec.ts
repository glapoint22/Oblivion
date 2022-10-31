import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePointPriceComponent } from './price-point-price.component';

describe('PricePointPriceComponent', () => {
  let component: PricePointPriceComponent;
  let fixture: ComponentFixture<PricePointPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricePointPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricePointPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
