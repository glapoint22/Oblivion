import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonWidgetPropertiesComponent } from './button-widget-properties.component';

describe('ButtonWidgetPropertiesComponent', () => {
  let component: ButtonWidgetPropertiesComponent;
  let fixture: ComponentFixture<ButtonWidgetPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonWidgetPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonWidgetPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
