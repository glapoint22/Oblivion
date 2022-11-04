import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubproductNameComponent } from './subproduct-name.component';

describe('SubproductNameComponent', () => {
  let component: SubproductNameComponent;
  let fixture: ComponentFixture<SubproductNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubproductNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubproductNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
