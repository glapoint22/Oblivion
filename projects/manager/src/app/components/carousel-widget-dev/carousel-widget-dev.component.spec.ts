import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselWidgetDevComponent } from './carousel-widget-dev.component';

describe('CarouselWidgetDevComponent', () => {
  let component: CarouselWidgetDevComponent;
  let fixture: ComponentFixture<CarouselWidgetDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselWidgetDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselWidgetDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
