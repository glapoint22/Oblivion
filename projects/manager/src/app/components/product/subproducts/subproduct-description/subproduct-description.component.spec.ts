import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubproductDescriptionComponent } from './subproduct-description.component';

describe('SubproductDescriptionComponent', () => {
  let component: SubproductDescriptionComponent;
  let fixture: ComponentFixture<SubproductDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubproductDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubproductDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
