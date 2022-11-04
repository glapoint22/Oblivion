import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubproductImageComponent } from './subproduct-image.component';

describe('SubproductImageComponent', () => {
  let component: SubproductImageComponent;
  let fixture: ComponentFixture<SubproductImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubproductImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubproductImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
