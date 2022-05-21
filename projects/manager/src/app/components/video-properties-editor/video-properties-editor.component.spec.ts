import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPropertiesEditorComponent } from './video-properties-editor.component';

describe('VideoPropertiesEditorComponent', () => {
  let component: VideoPropertiesEditorComponent;
  let fixture: ComponentFixture<VideoPropertiesEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoPropertiesEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoPropertiesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
