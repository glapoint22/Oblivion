import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCircleButtonsComponent } from './product-circle-buttons.component';

describe('ProductCircleButtonsComponent', () => {
  let component: ProductCircleButtonsComponent;
  let fixture: ComponentFixture<ProductCircleButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCircleButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCircleButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
