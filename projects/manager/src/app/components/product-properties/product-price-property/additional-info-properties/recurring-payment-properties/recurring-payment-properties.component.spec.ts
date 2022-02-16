import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringPaymentPropertiesComponent } from './recurring-payment-properties.component';

describe('RecurringPaymentPropertiesComponent', () => {
  let component: RecurringPaymentPropertiesComponent;
  let fixture: ComponentFixture<RecurringPaymentPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecurringPaymentPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringPaymentPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
