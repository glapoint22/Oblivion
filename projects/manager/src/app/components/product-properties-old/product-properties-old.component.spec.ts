import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPropertiesOldComponent } from './product-properties-old.component';

describe('ProductPropertiesOldComponent', () => {
  let component: ProductPropertiesOldComponent;
  let fixture: ComponentFixture<ProductPropertiesOldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductPropertiesOldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPropertiesOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
