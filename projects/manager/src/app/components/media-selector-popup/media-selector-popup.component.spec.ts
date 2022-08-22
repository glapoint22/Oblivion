import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaSelectorPopupComponent } from './media-selector-popup.component';

describe('MediaSelectorPopupComponent', () => {
  let component: MediaSelectorPopupComponent;
  let fixture: ComponentFixture<MediaSelectorPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaSelectorPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaSelectorPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
