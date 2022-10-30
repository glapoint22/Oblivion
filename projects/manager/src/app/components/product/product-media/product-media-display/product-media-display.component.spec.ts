import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMediaDisplayComponent } from './product-media-display.component';

describe('ProductMediaDisplayComponent', () => {
  let component: ProductMediaDisplayComponent;
  let fixture: ComponentFixture<ProductMediaDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductMediaDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMediaDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
