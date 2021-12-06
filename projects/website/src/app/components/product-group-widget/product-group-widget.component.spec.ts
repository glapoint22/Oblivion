import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGroupWidgetComponent } from './product-group-widget.component';

describe('ProductGroupWidgetComponent', () => {
  let component: ProductGroupWidgetComponent;
  let fixture: ComponentFixture<ProductGroupWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductGroupWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGroupWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
