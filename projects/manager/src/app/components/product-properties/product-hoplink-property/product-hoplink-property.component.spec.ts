import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductHoplinkPropertyComponent } from './product-hoplink-property.component';

describe('ProductHoplinkPropertyComponent', () => {
  let component: ProductHoplinkPropertyComponent;
  let fixture: ComponentFixture<ProductHoplinkPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductHoplinkPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductHoplinkPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
