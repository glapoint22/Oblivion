import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSetWidgetComponent } from './image-set-widget.component';

describe('ImageSetWidgetComponent', () => {
  let component: ImageSetWidgetComponent;
  let fixture: ComponentFixture<ImageSetWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageSetWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSetWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
