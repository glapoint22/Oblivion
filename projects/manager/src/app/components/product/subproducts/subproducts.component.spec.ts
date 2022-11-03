import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubproductsComponent } from './subproducts.component';

describe('SubproductsComponent', () => {
  let component: SubproductsComponent;
  let fixture: ComponentFixture<SubproductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubproductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
