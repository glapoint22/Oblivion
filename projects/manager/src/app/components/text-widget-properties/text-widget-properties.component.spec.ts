import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextWidgetPropertiesComponent } from './text-widget-properties.component';

describe('TextWidgetPropertiesComponent', () => {
  let component: TextWidgetPropertiesComponent;
  let fixture: ComponentFixture<TextWidgetPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextWidgetPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextWidgetPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
