import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSliderWidgetDevComponent } from './product-slider-widget-dev.component';

describe('ProductSliderWidgetDevComponent', () => {
  let component: ProductSliderWidgetDevComponent;
  let fixture: ComponentFixture<ProductSliderWidgetDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSliderWidgetDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSliderWidgetDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
