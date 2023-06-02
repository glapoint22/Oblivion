import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCurrencyComponent } from './product-currency.component';

describe('ProductCurrencyComponent', () => {
  let component: ProductCurrencyComponent;
  let fixture: ComponentFixture<ProductCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCurrencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
