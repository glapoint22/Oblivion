import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxHierarchyComponent } from './checkbox-hierarchy.component';

describe('CheckboxHierarchyComponent', () => {
  let component: CheckboxHierarchyComponent;
  let fixture: ComponentFixture<CheckboxHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckboxHierarchyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
