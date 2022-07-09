import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringPopupComponent } from './recurring-popup.component';

describe('RecurringPopupComponent', () => {
  let component: RecurringPopupComponent;
  let fixture: ComponentFixture<RecurringPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecurringPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
