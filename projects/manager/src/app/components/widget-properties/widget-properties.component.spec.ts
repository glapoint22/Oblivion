import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetPropertiesComponent } from './widget-properties.component';

describe('WidgetPropertiesComponent', () => {
  let component: WidgetPropertiesComponent;
  let fixture: ComponentFixture<WidgetPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
