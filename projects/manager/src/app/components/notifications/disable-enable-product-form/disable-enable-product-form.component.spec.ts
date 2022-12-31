import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisableEnableProductFormComponent } from './disable-enable-product-form.component';

describe('DisableEnableProductFormComponent', () => {
  let component: DisableEnableProductFormComponent;
  let fixture: ComponentFixture<DisableEnableProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisableEnableProductFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisableEnableProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
