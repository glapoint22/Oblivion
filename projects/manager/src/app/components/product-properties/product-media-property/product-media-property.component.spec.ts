import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMediaPropertyComponent } from './product-media-property.component';

describe('ProductMediaPropertyComponent', () => {
  let component: ProductMediaPropertyComponent;
  let fixture: ComponentFixture<ProductMediaPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductMediaPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMediaPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
