import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPickerPopupComponent } from './color-picker-popup.component';

describe('ColorPickerPopupComponent', () => {
  let component: ColorPickerPopupComponent;
  let fixture: ComponentFixture<ColorPickerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorPickerPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
