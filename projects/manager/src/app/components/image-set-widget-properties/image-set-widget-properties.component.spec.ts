import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSetWidgetPropertiesComponent } from './image-set-widget-properties.component';

describe('ImageSetWidgetPropertiesComponent', () => {
  let component: ImageSetWidgetPropertiesComponent;
  let fixture: ComponentFixture<ImageSetWidgetPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageSetWidgetPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSetWidgetPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
