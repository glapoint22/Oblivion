import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImagePropertyComponent } from './product-image-property.component';

describe('ProductImagePropertyComponent', () => {
  let component: ProductImagePropertyComponent;
  let fixture: ComponentFixture<ProductImagePropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductImagePropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductImagePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
