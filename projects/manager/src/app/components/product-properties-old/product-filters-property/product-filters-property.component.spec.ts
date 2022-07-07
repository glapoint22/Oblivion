import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFiltersPropertyComponent } from './product-filters-property.component';

describe('ProductFiltersPropertyComponent', () => {
  let component: ProductFiltersPropertyComponent;
  let fixture: ComponentFixture<ProductFiltersPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductFiltersPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFiltersPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
