import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVendorPropertyComponent } from './product-vendor-property.component';

describe('ProductVendorPropertyComponent', () => {
  let component: ProductVendorPropertyComponent;
  let fixture: ComponentFixture<ProductVendorPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductVendorPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVendorPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
