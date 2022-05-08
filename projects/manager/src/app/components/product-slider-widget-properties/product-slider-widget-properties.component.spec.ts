import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSliderWidgetPropertiesComponent } from './product-slider-widget-properties.component';

describe('ProductSliderWidgetPropertiesComponent', () => {
  let component: ProductSliderWidgetPropertiesComponent;
  let fixture: ComponentFixture<ProductSliderWidgetPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSliderWidgetPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSliderWidgetPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
