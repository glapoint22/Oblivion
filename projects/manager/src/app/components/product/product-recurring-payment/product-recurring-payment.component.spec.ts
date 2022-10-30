import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRecurringPaymentComponent } from './product-recurring-payment.component';

describe('ProductRecurringPaymentComponent', () => {
  let component: ProductRecurringPaymentComponent;
  let fixture: ComponentFixture<ProductRecurringPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductRecurringPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRecurringPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
