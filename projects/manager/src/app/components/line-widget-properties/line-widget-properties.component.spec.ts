import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineWidgetPropertiesComponent } from './line-widget-properties.component';

describe('LineWidgetPropertiesComponent', () => {
  let component: LineWidgetPropertiesComponent;
  let fixture: ComponentFixture<LineWidgetPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineWidgetPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineWidgetPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
