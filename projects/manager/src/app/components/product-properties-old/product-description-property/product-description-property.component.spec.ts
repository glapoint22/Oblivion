import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDescriptionPropertyComponent } from './product-description-property.component';

describe('ProductDescriptionPropertyComponent', () => {
  let component: ProductDescriptionPropertyComponent;
  let fixture: ComponentFixture<ProductDescriptionPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDescriptionPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDescriptionPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
