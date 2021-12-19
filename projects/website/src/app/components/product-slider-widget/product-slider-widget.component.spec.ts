import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSliderWidgetComponent } from './product-slider-widget.component';

describe('ProductSliderWidgetComponent', () => {
  let component: ProductSliderWidgetComponent;
  let fixture: ComponentFixture<ProductSliderWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSliderWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSliderWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
