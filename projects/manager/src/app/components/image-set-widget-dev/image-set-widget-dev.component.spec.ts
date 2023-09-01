import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSetWidgetDevComponent } from './image-set-widget-dev.component';

describe('ImageSetWidgetDevComponent', () => {
  let component: ImageSetWidgetDevComponent;
  let fixture: ComponentFixture<ImageSetWidgetDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageSetWidgetDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSetWidgetDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
