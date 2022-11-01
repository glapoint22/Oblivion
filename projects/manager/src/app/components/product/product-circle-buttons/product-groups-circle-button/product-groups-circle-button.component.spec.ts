import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGroupsCircleButtonComponent } from './product-groups-circle-button.component';

describe('ProductGroupsCircleButtonComponent', () => {
  let component: ProductGroupsCircleButtonComponent;
  let fixture: ComponentFixture<ProductGroupsCircleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductGroupsCircleButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGroupsCircleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
