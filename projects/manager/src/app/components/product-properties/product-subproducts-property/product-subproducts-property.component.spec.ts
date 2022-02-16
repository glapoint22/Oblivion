import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSubproductsPropertyComponent } from './product-subproducts-property.component';

describe('ProductSubproductsPropertyComponent', () => {
  let component: ProductSubproductsPropertyComponent;
  let fixture: ComponentFixture<ProductSubproductsPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSubproductsPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSubproductsPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
