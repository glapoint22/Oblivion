import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPricePropertyComponent } from './product-price-property.component';

describe('ProductPricePropertyComponent', () => {
  let component: ProductPricePropertyComponent;
  let fixture: ComponentFixture<ProductPricePropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductPricePropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPricePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
