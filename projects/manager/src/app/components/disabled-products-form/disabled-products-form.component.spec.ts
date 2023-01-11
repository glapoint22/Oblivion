import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabledProductsFormComponent } from './disabled-products-form.component';

describe('DisabledProductsFormComponent', () => {
  let component: DisabledProductsFormComponent;
  let fixture: ComponentFixture<DisabledProductsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisabledProductsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabledProductsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
