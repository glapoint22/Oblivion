import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductProductGroupsComponent } from './product-product-groups.component';

describe('ProductProductGroupsComponent', () => {
  let component: ProductProductGroupsComponent;
  let fixture: ComponentFixture<ProductProductGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductProductGroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductProductGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
