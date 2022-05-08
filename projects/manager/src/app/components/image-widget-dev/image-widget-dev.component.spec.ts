import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageWidgetDevComponent } from './image-widget-dev.component';

describe('ImageWidgetDevComponent', () => {
  let component: ImageWidgetDevComponent;
  let fixture: ComponentFixture<ImageWidgetDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageWidgetDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageWidgetDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
