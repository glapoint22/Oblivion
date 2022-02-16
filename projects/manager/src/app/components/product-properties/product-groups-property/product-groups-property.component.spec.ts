import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGroupsPropertyComponent } from './product-groups-property.component';

describe('ProductGroupsPropertyComponent', () => {
  let component: ProductGroupsPropertyComponent;
  let fixture: ComponentFixture<ProductGroupsPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductGroupsPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGroupsPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
