import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProductGroupsComponent } from './form-product-groups.component';

describe('FormProductGroupsComponent', () => {
  let component: FormProductGroupsComponent;
  let fixture: ComponentFixture<FormProductGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormProductGroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormProductGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
