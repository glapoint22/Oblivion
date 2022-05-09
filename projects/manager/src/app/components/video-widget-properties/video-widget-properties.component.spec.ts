import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoWidgetPropertiesComponent } from './video-widget-properties.component';

describe('VideoWidgetPropertiesComponent', () => {
  let component: VideoWidgetPropertiesComponent;
  let fixture: ComponentFixture<VideoWidgetPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoWidgetPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoWidgetPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
