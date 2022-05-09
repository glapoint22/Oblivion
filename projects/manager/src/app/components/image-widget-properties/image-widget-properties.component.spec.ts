import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageWidgetPropertiesComponent } from './image-widget-properties.component';

describe('ImageWidgetPropertiesComponent', () => {
  let component: ImageWidgetPropertiesComponent;
  let fixture: ComponentFixture<ImageWidgetPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageWidgetPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageWidgetPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
