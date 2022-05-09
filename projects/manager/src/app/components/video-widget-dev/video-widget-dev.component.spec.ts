import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoWidgetDevComponent } from './video-widget-dev.component';

describe('VideoWidgetDevComponent', () => {
  let component: VideoWidgetDevComponent;
  let fixture: ComponentFixture<VideoWidgetDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoWidgetDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoWidgetDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
