import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubproductValueComponent } from './subproduct-value.component';

describe('SubproductValueComponent', () => {
  let component: SubproductValueComponent;
  let fixture: ComponentFixture<SubproductValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubproductValueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubproductValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
