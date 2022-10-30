import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductHoplinkComponent } from './product-hoplink.component';

describe('ProductHoplinkComponent', () => {
  let component: ProductHoplinkComponent;
  let fixture: ComponentFixture<ProductHoplinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductHoplinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductHoplinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
