import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGroupsFormComponent } from './product-groups-form.component';

describe('ProductGroupsFormComponent', () => {
  let component: ProductGroupsFormComponent;
  let fixture: ComponentFixture<ProductGroupsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductGroupsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGroupsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
