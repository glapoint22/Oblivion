import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorProductsPopupComponent } from './vendor-products-popup.component';

describe('VendorProductsPopupComponent', () => {
  let component: VendorProductsPopupComponent;
  let fixture: ComponentFixture<VendorProductsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorProductsPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorProductsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
