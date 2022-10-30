import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPricePointsComponent } from './product-price-points.component';

describe('ProductPricePointsComponent', () => {
  let component: ProductPricePointsComponent;
  let fixture: ComponentFixture<ProductPricePointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductPricePointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPricePointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
