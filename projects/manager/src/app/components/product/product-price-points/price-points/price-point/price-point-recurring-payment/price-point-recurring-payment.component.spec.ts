import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePointRecurringPaymentComponent } from './price-point-recurring-payment.component';

describe('PricePointRecurringPaymentComponent', () => {
  let component: PricePointRecurringPaymentComponent;
  let fixture: ComponentFixture<PricePointRecurringPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricePointRecurringPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricePointRecurringPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
