import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersCircleButtonComponent } from './filters-circle-button.component';

describe('FiltersCircleButtonComponent', () => {
  let component: FiltersCircleButtonComponent;
  let fixture: ComponentFixture<FiltersCircleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltersCircleButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersCircleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
