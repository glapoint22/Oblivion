import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonWidgetNormalPropertiesComponent } from './button-widget-normal-properties.component';

describe('ButtonWidgetNormalPropertiesComponent', () => {
  let component: ButtonWidgetNormalPropertiesComponent;
  let fixture: ComponentFixture<ButtonWidgetNormalPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonWidgetNormalPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonWidgetNormalPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
