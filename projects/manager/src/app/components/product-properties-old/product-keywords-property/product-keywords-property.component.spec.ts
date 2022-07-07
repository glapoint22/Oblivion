import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductKeywordsPropertyComponent } from './product-keywords-property.component';

describe('ProductKeywordsPropertyComponent', () => {
  let component: ProductKeywordsPropertyComponent;
  let fixture: ComponentFixture<ProductKeywordsPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductKeywordsPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductKeywordsPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
