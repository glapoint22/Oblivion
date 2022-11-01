import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGroupsPopupComponent } from './product-groups-popup.component';

describe('ProductGroupsPopupComponent', () => {
  let component: ProductGroupsPopupComponent;
  let fixture: ComponentFixture<ProductGroupsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductGroupsPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGroupsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
