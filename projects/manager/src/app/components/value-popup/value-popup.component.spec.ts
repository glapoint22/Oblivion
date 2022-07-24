import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuePopupComponent } from './value-popup.component';

describe('ValuePopupComponent', () => {
  let component: ValuePopupComponent;
  let fixture: ComponentFixture<ValuePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValuePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
